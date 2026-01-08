import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryRequestDto } from './dto/create-category-request.dto';
import { UpdateCategoryRequestDto } from './dto/update-category-request.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryMapper } from './category.mapper';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { handleError } from '@/utils/handle-error.util';
import { handleTransactionCodeGeneration } from '@/utils/transaction-code-generation.util';

@Injectable()
export class CategoryService extends BasePaginationCrudService<CategoryEntity, CategoryResponseDto> {
  protected SORTABLE_COLUMNS = ['code', 'nameEn', 'nameKh'];
  protected FILTER_COLUMNS = ['code', 'nameEn', 'nameKh'];
  protected SEARCHABLE_COLUMNS = ['code', 'nameEn', 'nameKh'];
  protected RELATIONSIP_FIELDS = ['createdBy'];

  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ){
    super();
  }

  protected get repository(): Repository<CategoryEntity> {
    return this.categoryRepository;
  }

  protected getMapperReponseEntityField(entities: CategoryEntity): Promise<CategoryResponseDto> {
    return CategoryMapper.toDto(entities);
  } 

  public async create(dto: CreateCategoryRequestDto): Promise<CategoryResponseDto> {
    try {
      let entity = CategoryMapper.toCreateEntity(dto);
      entity = await this.categoryRepository.save(entity);
      return CategoryMapper.toDto(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  public async nextCode(): Promise<string> {
    try {
      const nextCode = await handleTransactionCodeGeneration(this.categoryRepository, 'CT', false, 7);
      return nextCode;
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelection(): Promise<{id: number; nameEn: string; nameKh: string}[]> {
    try {
      const entities = await this.categoryRepository.find({
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

  public async findOne(id: number): Promise<CategoryResponseDto> {
    try {
      const entity = await this.categoryRepository.findOne({
        where: { id },
        relations: {
          createdBy: true,
        }
      });
      if (!entity) throw new NotFoundException();
      return CategoryMapper.toDto(entity);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error?.message);
    }
  }

  public async update(id: number, dto: UpdateCategoryRequestDto): Promise<CategoryResponseDto> {
    try {
      let entity = await this.categoryRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      entity = CategoryMapper.toUpdateEntity(entity, dto);
      entity = await this.categoryRepository.save(entity);
      return CategoryMapper.toDto(entity);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error?.message);
    }
  }

  public async remove(id: number): Promise<CategoryResponseDto> {
    try {
      const entity = await this.categoryRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.categoryRepository.softDelete(id);
      return CategoryMapper.toDto(entity);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error?.message);
    }
  }
}
