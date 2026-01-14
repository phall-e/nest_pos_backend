import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerTypeRequestDto } from './dto/create-customer-type-request.dto';
import { UpdateCustomerTypeRequestDto } from './dto/update-customer-type-request.dto';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { CustomerTypeEntity } from './entities/customer-type.entity';
import { CustomerTypeResponseDto } from './dto/customer-type-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerTypeMapper } from './customer-type.mapper';
import { handleError } from '@/utils/handle-error.util';

@Injectable()
export class CustomerTypeService extends BasePaginationCrudService<CustomerTypeEntity, CustomerTypeResponseDto>{

  protected SORTABLE_COLUMNS = ['code', 'nameEn', 'nameKh'];
  protected FILTER_COLUMNS = ['code', 'nameEn', 'nameKh'];
  protected SEARCHABLE_COLUMNS = ['code', 'nameEn', 'nameKh'];
  protected RELATIONSIP_FIELDS = ['createdBy'];

  constructor(
    @InjectRepository(CustomerTypeEntity)
    private customerTypeRepository: Repository<CustomerTypeEntity>
  ){
    super();
  }

  protected get repository(): Repository<CustomerTypeEntity> {
    return this.customerTypeRepository;
  }

  protected getMapperReponseEntityField(entities: CustomerTypeEntity): Promise<CustomerTypeResponseDto> {
    return CustomerTypeMapper.toDto(entities);
  }

  public async create(dto: CreateCustomerTypeRequestDto): Promise<CustomerTypeResponseDto> {
    try { 
      let entity = CustomerTypeMapper.toCreateEntity(dto);
      entity = await this.customerTypeRepository.save(entity);
      return CustomerTypeMapper.toDto(entity);
    } catch (errro) {
      handleError(errro);
    }
  }

  public async findAllForSelection(): Promise<{ id: number; nameEn: string; nameKh: string }[]> {
    try {
      const entities = await this.customerTypeRepository.find({
        select: {
          id: true,
          nameEn: true,
          nameKh: true,
        }
      });
      return entities;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<CustomerTypeResponseDto> {
    try {
      const entity = await this.customerTypeRepository.findOne({
        where: { id },
        relations: {
          createdBy: true,
        }
      });
      if (!entity) throw new NotFoundException();
      return CustomerTypeMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: number, dto: UpdateCustomerTypeRequestDto): Promise<CustomerTypeResponseDto> {
    try {
      let entity = await this.customerTypeRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      entity = CustomerTypeMapper.toUpdateEntity(entity, dto);
      entity = await this.customerTypeRepository.save(entity);
      return CustomerTypeMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async  remove(id: number): Promise<CustomerTypeResponseDto> {
    try {
      const entity = await this.customerTypeRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.customerTypeRepository.softDelete(id);
      return CustomerTypeMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
