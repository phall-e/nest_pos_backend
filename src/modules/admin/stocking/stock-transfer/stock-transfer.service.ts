import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockTransferRequestDto } from './dto/create-stock-transfer-request.dto';
import { UpdateStockTransferRequestDto } from './dto/update-stock-transfer-request.dto';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { StockTransferEntity } from './entities/stock-transfer.entity';
import { StockTransferResponseDto } from './dto/stock-transfer-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StockTransferItemEntity } from './entities/stock-transfer-item.entity';
import { StockService } from '../stock/stock.service';
import { StockTransferMapper } from './stock-transfer.mapper';
import { handleError } from '@/utils/handle-error.util';
import { StockIncrementRequestDto } from '../stock/dto/stock-increment-request.dto';
import { handleTransactionCodeGeneration } from '@/utils/transaction-code-generation.util';

@Injectable()
export class StockTransferService extends BasePaginationCrudService<StockTransferEntity, StockTransferResponseDto>{
  protected SEARCHABLE_COLUMNS = ['code', 'branch.nameEn', 'branch.nameKh', 'description', 'createdBy.username'];
  protected SORTABLE_COLUMNS = ['code', 'branch.nameEn', 'branch.nameKh', 'description', 'totalQuantity', 'createdAt', 'createdBy.username'];
  protected FILTER_COLUMNS = ['code', 'branch.nameEn', 'branch.nameKh', 'description', 'totalQuantity', 'createdAt', 'createdBy.username'];
  protected RELATIONSIP_FIELDS = ['branch', 'createdBy'];

  constructor(
    @InjectRepository(StockTransferEntity)
    private stockTrasnferRepository: Repository<StockTransferEntity>,
    @InjectRepository(StockTransferItemEntity)
    private stockTransferItemRepository: Repository<StockTransferItemEntity>,
    private dataSource: DataSource,
    private stockService: StockService,
  ){
    super();
  }

  protected get repository(): Repository<StockTransferEntity> {
    return this.stockTrasnferRepository;
  }

  protected getMapperReponseEntityField(entities: StockTransferEntity): Promise<StockTransferResponseDto> {
    return StockTransferMapper.toDto(entities);
  }

  public async create(dto: CreateStockTransferRequestDto): Promise<StockTransferResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let entity = StockTransferMapper.toCreateEntity(dto);
      entity = await this.stockTrasnferRepository.save(entity);

      const fromBranchIncrementDto: StockIncrementRequestDto = {
        branchIds: entity.items.map(_e => entity.fromBranchId),
        productIds: entity.items.map(e => e.productId),
        quantities: entity.items.map(e => e.quantity),
      };
      await this.stockService.stockIncrement(fromBranchIncrementDto, 'stockTransfer');

      const toBranchIncrementDto: StockIncrementRequestDto = {
        branchIds: entity.items.map(_e => entity.toBranchId),
        productIds: entity.items.map(e => e.productId),
        quantities: entity.items.map(e => - e.quantity),
      };
      await this.stockService.stockIncrement(toBranchIncrementDto, 'stockTransfer');

      await queryRunner.commitTransaction();

      return StockTransferMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async nextCode(): Promise<string> {
      try {
        const nextCode = await handleTransactionCodeGeneration(this.stockTrasnferRepository, 'ST');
        return nextCode;
      } catch (error) {
        handleError(error);
      }
    }

  public async findOne(id: number): Promise<StockTransferResponseDto> {
    try {
      const entity = await this.stockTrasnferRepository.findOne({
        where: { id },
        relations: {
          fromBranch: true,
          toBranch: true,
          createdBy: true,
          items: {
            product: true,
          },
        },
      });

      if (!entity) throw new NotFoundException();
      return StockTransferMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: number, dto: UpdateStockTransferRequestDto): Promise<StockTransferResponseDto> {
    try {
      let entity = await this.stockTrasnferRepository.findOne({
        where: { id },
        relations: {
          items: true,
        },
      });
      if (!entity) throw new NotFoundException();

      const existingItemIds = entity.items.map(i => i.id);
      const dtoItemIds = dto.items.map(i => i.id) ?? [];

      const itemsToRemove = existingItemIds.filter(
        id => !dtoItemIds.includes(id),
      );

      if (itemsToRemove.length > 0) {
        await this.stockTransferItemRepository.softDelete(itemsToRemove);
      }

      entity = StockTransferMapper.toUpdateEntity(entity, dto);
      entity = await this.stockTrasnferRepository.save(entity);

      entity = await this.stockTrasnferRepository.findOne({
        where: { id },
        relations: {
          fromBranch: true,
          toBranch: true,
          createdBy: true,
          items: {
            product: true,
          },
        },
      });

      return StockTransferMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<StockTransferResponseDto> {
    try {
      const entity = await this.stockTrasnferRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.stockTrasnferRepository.softDelete(id);
      return StockTransferMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
