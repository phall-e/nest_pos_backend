import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockAdjustmentRequestDto } from './dto/create-stock-adjustment-request.dto';
import { UpdateStockAdjustmentRequestDto } from './dto/update-stock-adjustment-request.dto';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { StockAdjustmentEntity } from './entities/stock-adjustment.entity';
import { StockAdjustmentResponseDto } from './dto/stock-adjustment-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { handleError } from '@/utils/handle-error.util';
import { StockAdjustmentMapper } from './stock-adjustment.mapper';
import { StockIncrementRequestDto } from '../stock/dto/stock-increment-request.dto';
import { StockService } from '../stock/stock.service';
import { handleTransactionCodeGeneration } from '@/utils/transaction-code-generation.util';
import { StockAdjustmentItemEntity } from './entities/stock-adjustment-item.entity';

@Injectable()
export class StockAdjustmentService extends BasePaginationCrudService<StockAdjustmentEntity, StockAdjustmentResponseDto>{
  protected SEARCHABLE_COLUMNS = ['code', 'branch.nameEn', 'branch.nameKh', 'description', 'createdBy.username'];
  protected SORTABLE_COLUMNS = ['code', 'branch.nameEn', 'branch.nameKh', 'description', 'totalQuantity', 'createdAt', 'createdBy.username'];
  protected FILTER_COLUMNS = ['code', 'branch.nameEn', 'branch.nameKh', 'description', 'totalQuantity', 'createdAt', 'createdBy.username'];
  protected RELATIONSIP_FIELDS = ['branch', 'createdBy'];

  constructor(
    @InjectRepository(StockAdjustmentEntity)
    private stockAdjustmentRepository: Repository<StockAdjustmentEntity>,
    @InjectRepository(StockAdjustmentItemEntity)
    private stockAdjustmentItemRepository: Repository<StockAdjustmentItemEntity>,
    private dataSource: DataSource,
    private stockService: StockService,
  ){
    super();
  }

  protected get repository(): Repository<StockAdjustmentEntity> {
    return this.stockAdjustmentRepository;
  }

  protected getMapperReponseEntityField(entities: StockAdjustmentEntity): Promise<StockAdjustmentResponseDto> {
    return StockAdjustmentMapper.toDto(entities);
  }

  public async create(dto: CreateStockAdjustmentRequestDto): Promise<StockAdjustmentResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let entity = StockAdjustmentMapper.toCreateEntity(dto);
      entity = await this.stockAdjustmentRepository.save(entity);

      const incrementDto: StockIncrementRequestDto = {
        branchIds: entity.items.map(_e => entity.branchId),
        productIds: entity.items.map(e => e.productId),
        quantities: entity.items.map(e => e.quantity),
      };

      await this.stockService.stockIncrement(incrementDto, 'stockAdjustment');
      await queryRunner.commitTransaction();

      return StockAdjustmentMapper.toDto(entity);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  public async nextCode(): Promise<string> {
    try {
      const nextCode = await handleTransactionCodeGeneration(this.stockAdjustmentRepository, 'ST');
      return nextCode;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<StockAdjustmentResponseDto> {
    try {
      const entity = await this.stockAdjustmentRepository.findOne({
        where: { id },
        relations: {
          branch: true,
          createdBy: true,
          items: {
            product: true,
          },
        }
      });
      if (!entity) throw new NotFoundException();
      return StockAdjustmentMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: number, dto: UpdateStockAdjustmentRequestDto): Promise<StockAdjustmentResponseDto> {
    try {
      let entity = await this.stockAdjustmentRepository.findOne({
        where: { id },
        relations: {
          items: true,
        }, 
      });

      if (!entity) throw new NotFoundException();

      const existingItemIds = entity.items.map(i => i.id);
      const dtoItemIds = dto.items?.map(i => i.id) ?? [];

      const itemsToRemove = existingItemIds.filter(
        id => !dtoItemIds.includes(id),
      );

      if (itemsToRemove.length > 0) {
        await this.stockAdjustmentItemRepository.softDelete(itemsToRemove);
      }

      entity = StockAdjustmentMapper.toUpdateEntity(entity, dto);
      entity = await this.stockAdjustmentRepository.save(entity);

      entity = await this.stockAdjustmentRepository.findOne({
        where: { id },
        relations: {
          branch: true,
          createdBy: true,
          items: {
            product: true,
          },
        },
      });
      return StockAdjustmentMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<StockAdjustmentResponseDto> {
    try {
      const entity = await this.stockAdjustmentRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.stockAdjustmentRepository.softDelete(id);
      return StockAdjustmentMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
