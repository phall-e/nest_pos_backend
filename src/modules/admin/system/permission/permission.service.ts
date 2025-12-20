import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionRequestDto } from './dto/create-permission-request.dto';
import { UpdatePermissionRequestDto } from './dto/update-permission-request.dto';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { PermissionMapper } from './permission.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from './entities/permission.entity';
import { Filter, Repository } from 'typeorm';
// import { BaseCrudService } from '@/common/services/base-crud.service';

export const PERMISSION_FILTER_FIELDS = [
  'name',
  'description'
]

@Injectable()
export class PermissionService{

  protected queryName: string = 'role';
  protected SEARCH_FIELDS = ['name', 'description'];
  protected FILTER_FIELDS = PERMISSION_FILTER_FIELDS;
  

  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ){
    // super();
  }

  protected getMapperResponseEntityField() {
    return PermissionMapper.toDto;
  }
  
  protected getFilters() {
    const filters: { [key: string]: Filter<PermissionEntity> } = {
      // isActive: (query, value) => {
      //   return query.andWhere('role.isActive = :isActivev', {
      //     isActive: value,
      //   })
      // }
    }

    return filters;
  }

  public async create(dto: CreatePermissionRequestDto): Promise<PermissionResponseDto> {
    try {
      let entity = PermissionMapper.toCreateEntity(dto);
      entity = await this.permissionRepository.save(entity);
      return PermissionMapper.toDto(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  protected getListQuery() {
    return this.permissionRepository.createQueryBuilder('role')
  }

  public async findAllForSelection(): Promise<{ id: number; name: string, description: string }[]> {
    try {
      const entities = await this.permissionRepository.find({
        select: {
          id: true,
          name: true, 
          description: true,
        }
      });
      return entities;
    } catch (error) { 
      throw new BadRequestException(error?.message);
    }
  }


  public async findOne(id: number): Promise<PermissionResponseDto> {
    try {
      const entity = await this.permissionRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      return PermissionMapper.toDto(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  public async update(id: number, dto: UpdatePermissionRequestDto): Promise<PermissionResponseDto> {
    try {
      let entity = await this.permissionRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      entity = PermissionMapper.toUpdateEntity(entity, dto);
      entity = await this.permissionRepository.save(entity);
      return PermissionMapper.toDto(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  public async remove(id: number): Promise<PermissionResponseDto> {
    try {
      const entity = await this.permissionRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.permissionRepository.softDelete(id);
      return PermissionMapper.toDto(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
