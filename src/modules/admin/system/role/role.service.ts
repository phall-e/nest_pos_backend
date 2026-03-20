import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { UpdateRoleRequestDto } from './dto/update-role-request.dto';
import { RoleMapper } from './role.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { RoleResponseDto } from './dto/role-response.dto';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { PermissionEntity } from '../permission/entities/permission.entity';
// import { BaseCrudService } from '@/common/services/base-crud.service';

export const ROLE_FILTER_FIELDS = [
  'name',
  'description'
]

@Injectable()
export class RoleService extends BasePaginationCrudService<RoleEntity, RoleResponseDto>{
  protected SORTABLE_COLUMNS = ['name', 'description'];
  protected FILTER_COLUMNS = ['name', 'description'];
  protected SEARCHABLE_COLUMNS = ['name', 'description'];

  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ){
    super();
  }

  protected get repository(): Repository<RoleEntity> {
    return this.roleRepository;
  }

  protected getMapperReponseEntityField(entities: RoleEntity): Promise<RoleResponseDto> {
    return RoleMapper.toDto(entities);
  }

  
  public async create(dto: CreateRoleRequestDto): Promise<RoleResponseDto> {
    try {
      let entity = RoleMapper.toCreateEntity(dto);
      entity = await this.roleRepository.save(entity);
      await this.roleRepository
        .createQueryBuilder()
        .relation(RoleEntity, 'permissions')
        .of(entity)
        .add(dto.permissions);
      return RoleMapper.toDto(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  public async findAllForSelection(): Promise<{ id: number; name: string }[]> {
    try {
      const entities = await this.roleRepository.find({
        select: {
          id: true,
          name: true, 
        }
      });
      return entities;
    } catch (error) { 
      throw new BadRequestException(error?.message);
    }
  }

  public async findOne(id: number): Promise<RoleResponseDto> {
    try {
      const entity = await this.roleRepository.findOne({
        where: { id },
        relations: {
          permissions: true,
        }
      });
      if (!entity) throw new NotFoundException();
      return RoleMapper.toDto(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  public async update(id: number, dto: UpdateRoleRequestDto): Promise<RoleResponseDto> {
    try {
      let entity = await this.roleRepository.findOneBy({ id });
      entity = RoleMapper.toUpdateEntity(entity, dto);
      entity = await this.roleRepository.save(entity);
      return RoleMapper.toDto(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  public async remove(id: number): Promise<RoleResponseDto> {
    try {
      const entity = await this.roleRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.roleRepository.softDelete(id);
      return RoleMapper.toDto(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
