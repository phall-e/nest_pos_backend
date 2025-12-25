import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductsByBranchRequestDto } from './dto/create-products-by-branch-request.dto';
import { UpdateProductsByBranchRequestDto } from './dto/update-products-by-branch-request.dto';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsByBranchesEntity } from './entities/products-by-branch.entity';
import { Repository } from 'typeorm';
import { ProductsByBranchesMapper } from './products-by-branches.mapper';
import { ProductsByBranchesResponseDto } from './dto/products-by-branches-response.dto';
import { handleError } from '@/utils/handle-error.util';

@Injectable()
export class ProductsByBranchesService extends BasePaginationCrudService<ProductsByBranchesEntity, ProductsByBranchesResponseDto>{
  protected SORTABLE_COLUMNS = ['productId', 'branchId', 'salePrice', 'note', 'createdAt'];
  protected FILTER_COLUMNS = ['productId', 'branchId', 'salePrice', 'note'];
  protected SEARCHABLE_COLUMNS = ['product.nameEn','product.nameKh', 'salePrice', 'note'];
  protected RELATIONSIP_FIELDS = ['product.category', 'branch', 'createdBy'];
  constructor(
    @InjectRepository(ProductsByBranchesEntity)
    private productsByBranchesRepository: Repository<ProductsByBranchesEntity>
  ){
    super();
  }

  protected get repository(): Repository<ProductsByBranchesEntity> {
    return this.productsByBranchesRepository;
  }

  protected getMapperReponseEntityField(entities: ProductsByBranchesEntity): Promise<ProductsByBranchesResponseDto> {
    return ProductsByBranchesMapper.toDto(entities);
  }

  public async create(dto: CreateProductsByBranchRequestDto): Promise<ProductsByBranchesResponseDto> {
    try {
      let entity = ProductsByBranchesMapper.toCreateEntity(dto);
      entity = await this.productsByBranchesRepository.save(entity);
      return ProductsByBranchesMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelection(branchId: number): Promise<any[]> {
    try {
      const entities = await this.productsByBranchesRepository.find({
        where: {
          branchId: branchId,
        },
        relations: {
           product: true,
        }
      });
      return entities;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<ProductsByBranchesResponseDto> {
    try {
      const entity = await this.productsByBranchesRepository.findOne({
        relations: {
          product: {
            category: true,
          },
          branch: true,
          createdBy: true,
        }
      });
      if (!entity) throw new NotFoundException();
      return ProductsByBranchesMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: number, dto: UpdateProductsByBranchRequestDto): Promise<ProductsByBranchesResponseDto> {
    try {
      let entity = await this.productsByBranchesRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      entity = ProductsByBranchesMapper.toUpdateEntity(entity, dto);
      entity = await this.productsByBranchesRepository.save(entity);
      return ProductsByBranchesMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<ProductsByBranchesResponseDto> {
    try {
      const entity = await this.productsByBranchesRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.productsByBranchesRepository.softDelete(id);
      return ProductsByBranchesMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
