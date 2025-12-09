import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { UpdateRoleRequestDto } from './dto/update-role-request.dto';
import { RoleMapper } from './role.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { Filter, Repository } from 'typeorm';
import { RoleResponseDto } from './dto/role-response.dto';
import { BaseCrudService } from '@/common/services/base-crud.service';

export const ROLE_FILTER_FIELDS = [
  'name',
  'description'
]

@Injectable()
export class RoleService extends BaseCrudService{

  protected queryName: string = 'role';
  protected SEARCH_FIELDS = ['name', 'description'];
  protected FILTER_FIELDS = ROLE_FILTER_FIELDS;

  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ){
    super();
  }

  protected getMapperResponseEntityField() {
      return RoleMapper.toDto;
    }
  
    protected getFilters() {
      const filters: { [key: string]: Filter<RoleEntity> } = {
        // isActive: (query, value) => {
        //   return query.andWhere('role.isActive = :isActivev', {
        //     isActive: value,
        //   })
        // }
      }
  
      return filters;
    }
  
  public async create(dto: CreateRoleRequestDto): Promise<RoleResponseDto> {
    try {
      let entity = RoleMapper.toCreateEntity(dto);
      entity = await this.roleRepository.save(entity);
      return RoleMapper.toDto(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  protected getListQuery() {
    return this.roleRepository.createQueryBuilder('role')
      
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
