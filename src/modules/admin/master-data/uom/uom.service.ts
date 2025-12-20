import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUomRequestDto } from './dto/create-uom-request.dto';
import { UpdateUomRequestDto } from './dto/update-uom-request.dto';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { UomEntity } from './entities/uom.entity';
import { UomResponseDto } from './dto/uom-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UomMapper } from './uom.mapper';

@Injectable()
export class UomService extends BasePaginationCrudService<UomEntity, UomResponseDto>{

  protected SORTABLE_COLUMNS = ['code', 'nameEn', 'nameKh'];
  protected FILTER_COLUMNS = ['code', 'nameEn', 'nameKh'];
  protected SEARCHABLE_COLUMNS = ['code', 'nameEn', 'nameKh'];
  protected RELATIONSIP_FIELDS = ['createdBy'];

  constructor(
    @InjectRepository(UomEntity)
    private uomRepository: Repository<UomEntity>
  ){
    super();
  }

  protected get repository(): Repository<UomEntity> {
    return this.uomRepository;
  }

  protected getMapperReponseEntityField(entities: UomEntity): Promise<UomResponseDto> {
    return UomMapper.toDto(entities);
  }

  public async create(dto: CreateUomRequestDto): Promise<UomResponseDto> {
    try { 
      let entity = UomMapper.toCreateEntity(dto);
      entity = await this.uomRepository.save(entity);
      return UomMapper.toDto(entity);
    } catch (errro) {
      throw new BadRequestException(errro?.message);
    }
  }

  public async findAllForSelection(): Promise<{ id: number; nameEn: string; nameKh: string }[]> {
    try {
      const entities = await this.uomRepository.find({
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

  public async findOne(id: number): Promise<UomResponseDto> {
    try {
      const entity = await this.uomRepository.findOne({
        where: { id },
        relations: {
          createdBy: true,
        }
      });
      if (!entity) throw new NotFoundException();
      return UomMapper.toDto(entity);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error?.message);
    }
  }

  public async update(id: number, dto: UpdateUomRequestDto): Promise<UomResponseDto> {
    try {
      let entity = await this.uomRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      entity = UomMapper.toUpdateEntity(entity, dto);
      entity = await this.uomRepository.save(entity);
      return UomMapper.toDto(entity);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error?.message);
    }
  }

  public async  remove(id: number): Promise<UomResponseDto> {
    try {
      const entity = await this.uomRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.uomRepository.softDelete(id);
      return UomMapper.toDto(entity);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error?.message);
    }
  }
}
