import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierRequestDto } from './dto/create-supplier-request.dto';
import { UpdateSupplierRequestDto } from './dto/update-supplier-request.dto';
import { SupplierResponseDto } from './dto/supplier-response.dto';
import { SupplierMapper } from './supplier.mapper';
import { handleError } from '@/utils/handle-error.util';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { handleTransactionCodeGeneration } from '@/utils/transaction-code-generation.util';

@Injectable()
export class SupplierService extends BasePaginationCrudService<SupplierEntity, SupplierResponseDto>{
  protected SORTABLE_COLUMNS = ['code', 'nameEn', 'nameKh', 'phoneNumber', 'address', 'createdAt'];
  protected FILTER_COLUMNS = ['code', 'nameEn', 'nameKh', 'phoneNumber', 'address', 'createdAt'];
  protected SEARCHABLE_COLUMNS = ['code', 'nameEn', 'nameKh', 'phoneNumber', 'address', 'createdBy.username'];
  protected RELATIONSIP_FIELDS = ['createdBy'];

  constructor(
    @InjectRepository(SupplierEntity)
    private supplierRepository: Repository<SupplierEntity>,
  ){
    super();
  }

  protected get repository(): Repository<SupplierEntity> {
    return this.supplierRepository;
  }

  protected getMapperReponseEntityField(entities: SupplierEntity): Promise<SupplierResponseDto> {
    return SupplierMapper.toDto(entities);
  }

  public async create(dto: CreateSupplierRequestDto): Promise<SupplierResponseDto> {
    try {
      let entity = SupplierMapper.toCreateEntity(dto);
      entity = await this.supplierRepository.save(entity);
      return SupplierMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async nextCode(): Promise<string> {
    try {
      const nextCode = await handleTransactionCodeGeneration(this.supplierRepository, 'SP', false, 5);
      return nextCode;
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelection(): Promise<{ id: number; code: string; nameEn: string; nameKh: string }[]> {
    try {
      const entities = await this.supplierRepository.find({
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

  public async findOne(id: number): Promise<SupplierResponseDto> {
    try {
      const entity = await this.supplierRepository.findOne({
        where: { id },
        relations: {
          createdBy: true,
        }
      });
      if (!entity) throw new NotFoundException();
      return SupplierMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: number, dto: UpdateSupplierRequestDto): Promise<SupplierResponseDto> {
    try {
      let entity = await this.supplierRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      entity = SupplierMapper.toUpdateEntity(entity, dto);
      entity = await this.supplierRepository.save(entity);
      return SupplierMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<SupplierResponseDto> {
    try {
      const entity = await this.supplierRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.supplierRepository.softDelete(id);
      return SupplierMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
