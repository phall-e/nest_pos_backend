import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSalePaymentReceiptRequestDto } from './dto/create-sale-payment-receipt-request.dto';
import { UpdateSalePaymentReceiptRequestDto } from './dto/update-sale-payment-receipt-request.dto';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { SalePaymentReceiptEntity } from './entities/sale-payment-receipt.entity';
import { SalePaymentReceiptResponseDto } from './dto/sale-payment-receipt-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { handleError } from '@/utils/handle-error.util';
import { handleTransactionCodeGeneration } from '@/utils/transaction-code-generation.util';
import { SalePaymentReceiptMapper } from './sale-payment-receipt.mapper';
import { SaleEntity } from '../sale/entities/sale.entity';
import { ModuleStatus } from '@/common/enums/status.enum';

@Injectable()
export class SalePaymentReceiptService extends BasePaginationCrudService<SalePaymentReceiptEntity, SalePaymentReceiptResponseDto>{
  protected SORTABLE_COLUMNS = ['code', 'sale.code', 'sale.customer.nameEn', 'sale.customer.nameKh'];
  protected FILTER_COLUMNS = ['code', 'receiptDate'];
  protected SEARCHABLE_COLUMNS = ['code', 'sale.code', 'sale.customer.nameEn', 'sale.customer.nameKh', 'note'];
  protected RELATIONSIP_FIELDS = ['sale.branch',  'sale.customer', 'sale.soleBy', 'receiptBy', 'createdBy'];

  constructor(
    @InjectRepository(SalePaymentReceiptEntity)
    private salePaymentReceiptRepository: Repository<SalePaymentReceiptEntity>,
    @InjectRepository(SaleEntity)
    private saleRepository: Repository<SaleEntity>,
    private dataSource: DataSource,
  ){
    super();
  }

  protected get repository(): Repository<SalePaymentReceiptEntity> {
    return this.salePaymentReceiptRepository;
  }

  protected getMapperReponseEntityField(entities: SalePaymentReceiptEntity): Promise<SalePaymentReceiptResponseDto> {
    return SalePaymentReceiptMapper.toDto(entities);
  }

  public async create(dto: CreateSalePaymentReceiptRequestDto): Promise<SalePaymentReceiptResponseDto> {

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let entity = SalePaymentReceiptMapper.toCreateEntity(dto);
      entity = await this.salePaymentReceiptRepository.save(entity);
      
      const saleEntity = await this.saleRepository.findOne({
        where: { id: entity.saleId },
      });

      if (saleEntity) {

        await this.saleRepository.increment({ id: saleEntity.id }, 'totalPaidAmount', entity.amount);
        const paidAmount = Number(entity.amount) + Number(saleEntity.totalPaidAmount);
        const amount = Number(saleEntity.totalAmount) - Number(saleEntity.totalDiscount);

        if (amount === paidAmount) {
          await this.saleRepository.update(
            { id: saleEntity.id },
            { status: ModuleStatus.PAID },
          );
        }

      }
      await queryRunner.commitTransaction();

      return SalePaymentReceiptMapper.toDto(entity);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleError(error); 
    } finally {
      await queryRunner.release();
    }
  }

  public async nextCode(): Promise<string> {
    try {
      const nextCode  = await handleTransactionCodeGeneration(this.salePaymentReceiptRepository, 'SRC');
      return nextCode;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<SalePaymentReceiptResponseDto> {
    try {
      const entity = await this.salePaymentReceiptRepository.findOne({
        where: { id },
        relations: {
          createdBy: true,
          receiptBy: true,
          sale: {
            branch: true,
            customer: true,
            soleBy: true,
          },
        }
      });
      if (!entity) throw new NotFoundException();
      return SalePaymentReceiptMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: number, dto: UpdateSalePaymentReceiptRequestDto): Promise<SalePaymentReceiptResponseDto> {

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let entity = await this.salePaymentReceiptRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();

      entity = SalePaymentReceiptMapper.toUpdateEntity(entity, dto);
      entity = await this.salePaymentReceiptRepository.save(entity);

      // const saleEntity = await this.saleRepository.findOneBy({ id: entity.saleId });

      await queryRunner.commitTransaction();

      return SalePaymentReceiptMapper.toDto(entity);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleError(error);
    } finally {
      await queryRunner.release();
    }

  }

  public async remove(id: number): Promise<SalePaymentReceiptResponseDto> {
    try {
      const entity = await this.salePaymentReceiptRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.salePaymentReceiptRepository.softDelete(id);
      return SalePaymentReceiptMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
