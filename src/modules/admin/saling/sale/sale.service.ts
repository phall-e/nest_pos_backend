import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleRequestDto } from './dto/create-sale-request.dto';
import { UpdateSaleRequestDto } from './dto/update-sale-request.dto';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { SaleEntity } from './entities/sale.entity';
import { SaleResponseDto } from './dto/sale-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { SaleItemEntity } from './entities/sale-item.entity';
import { SaleMapper } from './sale.mapper';
import { handleError } from '@/utils/handle-error.util';
import { ModuleStatus } from '@/common/enums/status.enum';
import { handleTransactionCodeGeneration } from '@/utils/transaction-code-generation.util';
import { StockService } from '../../stocking/stock/stock.service';
import { StockIncrementRequestDto } from '../../stocking/stock/dto/stock-increment-request.dto';
import { SalePaymentReceiptService } from '../sale-payment-receipt/sale-payment-receipt.service';

@Injectable()
export class SaleService extends BasePaginationCrudService<SaleEntity, SaleResponseDto>{
  protected SORTABLE_COLUMNS = ['code', 'saleDate', 'branchId', 'createdById', 'customerId'];
  protected FILTER_COLUMNS = ['code', 'saleDate', 'customer.nameEn', 'customer.nameKh', 'branch.nameEn', 'branch.nameKh', 'createdBy.username'];
  protected SEARCHABLE_COLUMNS = ['code', 'branch.nameEn', 'branch.nameKh', 'customer.nameEn', 'customer.nameKh', 'createdBy.username', 'description', 'status'];
  protected RELATIONSIP_FIELDS = ['branch',  'customer', 'soleBy', 'createdBy'];

  constructor(
    @InjectRepository(SaleEntity)
    private saleRepository: Repository<SaleEntity>,
    @InjectRepository(SaleItemEntity)
    private saleItemRepository: Repository<SaleItemEntity>,
    private stockService: StockService,
    private salePaymentReceiptService: SalePaymentReceiptService,
    private dataSource: DataSource,
  ){
    super();
  }

  protected get repository(): Repository<SaleEntity> {
    return this.saleRepository;
  }

  protected getMapperReponseEntityField(entities: SaleEntity): Promise<SaleResponseDto> {
    return SaleMapper.toDto(entities);
  }

  public async create(dto: CreateSaleRequestDto): Promise<SaleResponseDto> {

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const code = await this.nextCode();
      let entity = SaleMapper.toCreateEntity({ 
        ...dto, 
        code, 
      });
      entity = await this.saleRepository.save(entity);
      const incrementDto: StockIncrementRequestDto = {
        branchIds: entity.items.map(_e => entity.branchId),
        productIds: entity.items.map(e => e.productId),
        quantities: entity.items.map(e => e.quantity),
      };

      await this.stockService.stockIncrement(incrementDto, 'stockOut');

      if (dto.isPayNow) {
        const receiptNumber = await this.salePaymentReceiptService.nextCode();
        await this.salePaymentReceiptService.create({
          code: receiptNumber,
          saleId: entity.id,
          receiptById: entity.createdById,
          receiptDate: new Date(),
          amount: Number(dto.totalAmount) - Number(dto.totalDiscount),
          createdById: entity.createdById,
          note: '',
          attachments: [],
        });
      }

      await queryRunner.commitTransaction();

      return SaleMapper.toDto(entity);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleError(error); 
    } finally {
      await queryRunner.release();
    }
  }

  public async findAllForSelection(branchId: number, isAll: boolean): Promise<{ id: number; code: string }[]> {
    try {
      let wheres = null;
      if (isAll === false) {
        wheres = {
          branchId: branchId,
        } 
      } else {
        wheres = {
          status: Not(ModuleStatus.PAID),
          branchId: branchId,
        }
      }
      const entities = await this.saleRepository.find({
        where: wheres,
        select: {
          id: true,
          code: true,
        }
      });
      return entities;
    } catch (error) {
      handleError(error);
    }
  }

  public async nextCode(): Promise<string> {
    try {
      const nextCode  = await handleTransactionCodeGeneration(this.saleRepository, 'SL');
      return nextCode;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<SaleResponseDto> {
    try {
      const entity = await this.saleRepository.findOne({
        where: { id },
        relations: {
          branch: true,
          customer: true,
          soleBy: true,
          items: {
            product: {
              uom: true,
            },
          },
          salePaymentReceipts: {
            receiptBy: true,
          }
        }
      });
      if (!entity) throw new NotFoundException();
      return SaleMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: number, dto: UpdateSaleRequestDto): Promise<SaleResponseDto> {

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let entity = await this.saleRepository.findOne({
        where: { id },
        relations: {
          items: true,
        }
      });
      if (!entity) throw new NotFoundException();
      
      const existingItemIds = entity.items.map(i => i.id);
      const dtoItemIds = dto.items?.map(i => i.id) ?? [];

      const itemsToRemove = existingItemIds.filter(
        id => !dtoItemIds.includes(id),
      );

      const itemStockIncrement = dto.items.filter(item => itemsToRemove.includes(item.id));

      if (itemStockIncrement) {
         const decrementDto: StockIncrementRequestDto = {
          branchIds: itemStockIncrement.map(_e => entity.branchId),
          productIds: itemStockIncrement.map(e => e.id),
          quantities: itemStockIncrement.map(e =>  - e.quantity),
        };

        await this.stockService.stockIncrement(decrementDto, 'stockOut');
      }

      if (itemsToRemove.length > 0) {
        await this.saleItemRepository.softDelete(itemsToRemove);
      }

      entity = SaleMapper.toUpdateEntity(entity, dto);
      entity = await this.saleRepository.save(entity);

      await queryRunner.commitTransaction();

      entity = await this.saleRepository.findOne({
        where: { id },
        relations: {
          branch: true,
          customer: true,
          items: {
            product: true,
          },
        },
      });

      return SaleMapper.toDto(entity);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  public async remove(id: number): Promise<SaleResponseDto> {
    try {
      const entity = await this.saleRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.saleRepository.softDelete(id);
      return SaleMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
