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
  protected FILTER_COLUMNS = ['branchId', 'productId', 'createdById', 'product.categoryId'];
  protected SEARCHABLE_COLUMNS = ['branch.nameEn', 'branch.nameKh', 'product.nameEn', 'product.nameKh', 'product.code', 'createdById'];
  protected RELATIONSIP_FIELDS = ['branch', 'product.category', 'product.uom', 'createdBy'];

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
  
  public async create(
    dto: CreateStockRequestDto[]
  ): Promise<StockResponseDto[]> {
    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // ✅ Use QueryRunner manager
      let entities = StockMapper.toCreateEntities(dto)
      entities = await this.stockRepository.save(entities);
    
      await queryRunner.commitTransaction()

      return await Promise.all(
        entities.map(item => StockMapper.toDto(item))
      ); 
    } catch (error) {
      await queryRunner.rollbackTransaction()
      handleError(error)
    } finally {
      await queryRunner.release()
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

  public async findInBranchAndIds(branchId: number): Promise<StockEntity[]> {
    try {
      const query = await this.stockRepository.createQueryBuilder('stock')
        query.where('stock.branchId = :branchId', {
          branchId,
        })
        const entities = await query.getMany();
        return entities;
    } catch (error) {
      handleError(error);
    }
  }

  public async findByBranchAndId(branchId: number, productId: number): Promise<StockResponseDto> {
    try {
      const entity = await this.stockRepository.findOne({
        where: {
          branchId: branchId,
          productId: productId,
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

  public async stockIncrement(
    dto: StockIncrementRequestDto,
    key: keyof Pick<
      StockEntity,
      'stockIn' | 'stockAdjustment' | 'stockTransfer' | 'stockOut'
    >,
  ): Promise<void> {

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    const STOCK_COLUMN_MAP = {
      stockIn: 'stock_in',
      stockAdjustment: 'stock_adjustment',
      stockTransfer: 'stock_transfer',
      stockOut: 'stock_out',
    } as const

    try {
      const column = STOCK_COLUMN_MAP[key]

      if (!column) {
        throw new Error(`Invalid stock column: ${key}`)
      }

      for (let i = 0; i < dto.productIds.length; i++) {
        await queryRunner.manager
          .createQueryBuilder()
          .update(StockEntity)
          .set({
            // ✅ entity property on LEFT
            [key]: () => `"${column}" + :qty`,
          })
          .where('product_id = :productId', {
            productId: dto.productIds[i],
          })
          .andWhere('branch_id = :branchId', {
            branchId: dto.branchIds[i],
          })
          .setParameters({
            qty: Number(dto.quantities[i]),
          })
          .execute()
      }

      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      handleError(error)
    } finally {
      await queryRunner.release()
    }
  }

}
