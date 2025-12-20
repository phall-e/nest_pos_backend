import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { UpdateProductRequestDto } from './dto/update-product-request.dto';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { ProductEntity } from './entities/product.entity';
import { ProductResponseDto } from './dto/product-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductMapper } from './product.mapper';

@Injectable()
export class ProductService extends BasePaginationCrudService<ProductEntity, ProductResponseDto>{
  protected SORTABLE_COLUMNS = ['code', 'nameEn', 'nameKh', 'unitPrice', 'category.nameEn', 'uom.nameEn'];
  protected FILTER_COLUMNS = ['code', 'nameEn', 'nameKh'];
  protected SEARCHABLE_COLUMNS = ['code', 'nameEn', 'nameKh', 'unitPrice', 'category.nameEn', 'uom.nameEn'];
  protected RELATIONSIP_FIELDS = ['category', 'uom', 'createdBy'];

  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ){
    super();
  }
  
  protected get repository(): Repository<ProductEntity> {
    return this.productRepository;
  }

  protected getMapperReponseEntityField(entities: ProductEntity): Promise<ProductResponseDto> {
    return ProductMapper.toDto(entities);
  }

  public async create(dto: CreateProductRequestDto): Promise<ProductResponseDto> {
    try {
      let entity = ProductMapper.toCreateEntity(dto);
      entity = await this.productRepository.save(entity);
      return ProductMapper.toDto(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  public async findAllForSelection(): Promise<{id: number; nameEn: string; nameKh: string}[]> {
    try {
      const entities = await this.productRepository.find({
        select: {
          id: true,
          nameEn: true,
          nameKh: true,
        }
      });
      return entities;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  public async findOne(id: number): Promise<ProductResponseDto> {
    try {
      const entity = await this.productRepository.findOne({
        where: { id },
        relations: {
          category: true,
          uom: true,
          createdBy: true,
        }
      });
      if (!entity) throw new NotFoundException();
      return ProductMapper.toDto(entity);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error?.message);
    }
  }

  public async update(id: number, dto: UpdateProductRequestDto): Promise<ProductResponseDto> {
    try {
      let entity = await this.productRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      entity = ProductMapper.toUpdateEntity(entity, dto);
      entity = await this.productRepository.save(entity);
      return ProductMapper.toDto(entity);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error?.message);
    }
  }

  public async remove(id: number): Promise<ProductResponseDto> {
    try {
      const entity = await this.productRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.productRepository.softDelete(id);
      return ProductMapper.toDto(entity);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error?.message);
    }
  }
}
