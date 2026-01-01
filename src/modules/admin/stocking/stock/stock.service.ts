import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockRequestDto } from './dto/create-stock-request.dto';
import { UpdateStockRequestDto } from './dto/update-stock-request.dto';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { StockEntity } from './entities/stock.entity';
import { StockResponseDto } from './dto/stock-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StockMapper } from './stock.mapper';
import { handleError } from '@/utils/handle-error.util';
import { StockIncrementRequestDto } from './dto/stock-increment-request.dto';

@Injectable()
export class StockService extends BasePaginationCrudService<StockEntity, StockResponseDto>{
  protected SORTABLE_COLUMNS = ['branch.nameEn', 'branch.nameKh', 'product.nameEn', 'product.nameKh', 'createdById'];
  protected FILTER_COLUMNS = ['branch.nameEn', 'branch.nameKh', 'product.nameEn', 'product.nameKh', 'createdBy.username'];
  protected SEARCHABLE_COLUMNS = ['branch.nameEn', 'branch.nameKh', 'product.nameEn', 'product.nameKh', 'createdById'];
  protected RELATIONSIP_FIELDS = ['branch', 'product', 'createdBy'];

  constructor(
    @InjectRepository(StockEntity)
    private stockRepository: Repository<StockEntity>,
    private dataSource: DataSource,
  ){
    super();
  }

  protected get repository(): Repository<StockEntity> {
    return this.stockRepository;
  }

  protected getMapperReponseEntityField(entities: StockEntity): Promise<StockResponseDto> {
    return StockMapper.toDto(entities);
  }
  
  public async create(dto: CreateStockRequestDto): Promise<StockResponseDto> {
    try {
      let entity = StockMapper.toCreateEntity(dto);
      entity = await this.stockRepository.save(entity);
      return StockMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<StockResponseDto> {
    try {
      const entity = await this.stockRepository.findOne({
        where: { id },
        relations: {
          branch: true,
          product: true,
          createdBy: true,
        },
      });
      if (!entity) throw new NotFoundException();
      return StockMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: number, dto: UpdateStockRequestDto): Promise<StockResponseDto> {
    try {
      let entity = await this.stockRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      entity = StockMapper.toUpdateEntity(entity, dto);
      entity = await this.stockRepository.save(entity);
      return StockMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<StockResponseDto> {
    try {
      const entity = await this.stockRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.stockRepository.softDelete(id);
      return StockMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async stockIncrement(dto: StockIncrementRequestDto, key: keyof StockEntity): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate column name
      const allowKeys: (keyof StockEntity)[] = [
        'stockIn',
        'stockAdjustment',
        'stockTransfer',
        'stockOut',
      ];

      for (let i = 0; i < dto.branchIds.length; i++) {
        await queryRunner.manager
        .createQueryBuilder()
        .update(StockEntity)
        .set({
          [key]: () => `"${key}" + :qty`,
        })
        .andWhere('product_id = :productId', {
          productId: dto.productIds[i],
        })
        .setParameters({
          qty: dto.quantities[i],
        })
        .execute();
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleError(error);
    } finally {
      await queryRunner.release();
    }
  }
}
