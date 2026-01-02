import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockInRequestDto } from './dto/create-stock-in-request.dto';
import { UpdateStockInRequestDto } from './dto/update-stock-in-request.dto';
import { StockInResponseDto } from './dto/stock-in-response.dto';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { StockInEntity } from './entities/stock-in.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StockInMapper } from './stock-in.mapper';
import { handleError } from '@/utils/handle-error.util';
import { StockService } from '../stock/stock.service';
import { StockIncrementRequestDto } from '../stock/dto/stock-increment-request.dto';

@Injectable()
export class StockInService extends BasePaginationCrudService<StockInEntity, StockInResponseDto>{

  protected SEARCHABLE_COLUMNS = ['purchaseReceipt.code', 'branch.nameEn', 'branch.nameKh', 'product.nameEn', 'product.nameKh', 'product.code', 'createdAt'];
  protected FILTER_COLUMNS = ['purchaseReceipt.code', 'branch.nameEn', 'branch.nameKh', 'product.nameEn', 'product.nameKh', 'product.code', 'createdAt'];
  protected SORTABLE_COLUMNS = ['purchaseReceipt.code', 'branch.nameEn', 'branch.nameKh', 'product.nameEn', 'product.nameKh', 'product.code'];
  protected RELATIONSIP_FIELDS = ['purchaseReceipt', 'branch', 'product', 'createdBy'];

  constructor(
    @InjectRepository(StockInEntity)
    private stockInRepository: Repository<StockInEntity>,
    private stockService: StockService,
    private dataSource: DataSource,
  ){
    super();
  }

  protected get repository(): Repository<StockInEntity> {
    return this.stockInRepository;
  }

  protected getMapperReponseEntityField(entities: StockInEntity): Promise<StockInResponseDto> {
    return StockInMapper.toDto(entities);
  }

  public async create(dto: CreateStockInRequestDto): Promise<StockInResponseDto[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let entities = StockInMapper.toCreateEntity(dto);
      entities = await this.stockInRepository.save(entities);
      const incrementDto: StockIncrementRequestDto = {
        branchIds: entities.map(e => e.branchId),
        productIds: entities.map(e => e.productId),
        quantities: entities.map(e => e.quantity),
      }
      await this.stockService.stockIncrement(incrementDto, 'stockIn');
      await queryRunner.commitTransaction();
      return await Promise.all(
        entities.map(entity => StockInMapper.toDto(entity)),
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  public async findOne(id: number): Promise<StockInResponseDto> {
    try {
      const entity = await this.stockInRepository.findOne({
        where: { id },
        relations: {
          purchaseReceipt: true,
          branch: true,
          product: true,
          createdBy: true,
        },
      });

      if (!entity) throw new NotFoundException();

      return StockInMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: number, dto: UpdateStockInRequestDto): Promise<StockInResponseDto> {
    try {
      let entity = await this.stockInRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      entity = StockInMapper.toUpdateEntity(entity, dto);
      entity = await this.stockInRepository.save(entity);
      return StockInMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<StockInResponseDto> {
    try {
      const entity = await this.stockInRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.stockInRepository.softDelete(id);
      return StockInMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
