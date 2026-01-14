import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerRequestDto } from './dto/create-customer-request.dto';
import { UpdateCustomerRequestDto } from './dto/update-customer-request.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { CustomerMapper } from './customer.mapper';
import { handleError } from '@/utils/handle-error.util';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { handleTransactionCodeGeneration } from '@/utils/transaction-code-generation.util';

@Injectable()
export class CustomerService extends BasePaginationCrudService<CustomerEntity, CustomerResponseDto>{
  protected SORTABLE_COLUMNS = ['code', 'nameEn', 'nameKh', 'phoneNumber', 'address', 'createdAt'];
  protected FILTER_COLUMNS = ['code', 'nameEn', 'nameKh', 'phoneNumber', 'address', 'createdAt'];
  protected SEARCHABLE_COLUMNS = ['code', 'nameEn', 'nameKh', 'phoneNumber', 'address', 'createdBy.username'];
  protected RELATIONSIP_FIELDS = ['customerType', 'createdBy'];

  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ){
    super();
  }

  protected get repository(): Repository<CustomerEntity> {
    return this.customerRepository;
  }

  protected getMapperReponseEntityField(entities: CustomerEntity): Promise<CustomerResponseDto> {
    return CustomerMapper.toDto(entities);
  }

  public async create(dto: CreateCustomerRequestDto): Promise<CustomerResponseDto> {
    try {
      let entity = CustomerMapper.toCreateEntity(dto);
      entity = await this.customerRepository.save(entity);
      return CustomerMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async nextCode(): Promise<string> {
    try {
      const nextCode = await handleTransactionCodeGeneration(this.customerRepository, 'CS', false, 5);
      return nextCode;
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelection(): Promise<{ id: number; code: string; nameEn: string; nameKh: string }[]> {
    try {
      const entities = await this.customerRepository.find({
        select: {
          id: true,
          code: true,
          nameEn: true,
          nameKh: true,
        },
        order: {
          id: 'DESC',
        }
      });
      return entities;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<CustomerResponseDto> {
    try {
      const entity = await this.customerRepository.findOne({
        where: { id },
        relations: {
          createdBy: true,
        }
      });
      if (!entity) throw new NotFoundException();
      return CustomerMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: number, dto: UpdateCustomerRequestDto): Promise<CustomerResponseDto> {
    try {
      let entity = await this.customerRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      entity = CustomerMapper.toUpdateEntity(entity, dto);
      entity = await this.customerRepository.save(entity);
      return CustomerMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<CustomerResponseDto> {
    try {
      const entity = await this.customerRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.customerRepository.softDelete(id);
      return CustomerMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
