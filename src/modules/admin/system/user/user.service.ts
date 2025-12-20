import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Filter, Repository } from 'typeorm';
import { UserMapper } from './user.mapper';
// import { BaseCrudService } from '@/common/services/base-crud.service';

export const USER_FILTER_FIELDS = [
  'username',
]

@Injectable()
export class UserService{
  
  protected queryName: string = 'user';
  protected SEARCH_FIELDS = ['username'];
  protected FILTER_FIELDS = USER_FILTER_FIELDS;


  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ){
    // super()
  }

  protected getMapperResponseEntityField() {
    return UserMapper.toDto;
  }

  protected getFilters() {
    const filters: { [key: string]: Filter<UserEntity> } = {
      isActive: (query, value) => {
        return query.andWhere('user.isActive = :isActivev', {
          isActive: value,
        })
      }
    }

    return filters;
  }

  public async create(dto: CreateUserRequestDto): Promise<UserResponseDto> {
    try {
      let entity = UserMapper.toCreateEntity(dto);
      entity = await this.userRepository.save(entity);
      return UserMapper.toDto(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  protected getListQuery() {
    return this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles');
  }

  public async findAllForSelection(): Promise<{ id: number; username: string }[]> {
    try {
      const entities = await this.userRepository.find({
        select: {
          id: true,
          username: true,
        }
      });
      return entities;
    } catch (error) { 
      throw new BadRequestException(error?.message);
    }
  }

  public async findOne(id: number): Promise<UserResponseDto> {
    try {
      const entity = await this.userRepository.findOne({
        where: { id },
        relations: {
          roles: {
            permissions: true
          }
        }
      });
      if (!entity) throw new NotFoundException();
      return UserMapper.toDto(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  public async findOneByUsername(username: string): Promise<UserEntity | null> {
    const entity = await this.userRepository.findOne({
      where: {
        username: username,
      },
      relations: ['roles', 'roles.permissions'],
    });
    return entity;
  }

  public async update(id: number, dto: UpdateUserRequestDto): Promise<UserResponseDto> {
    try {
      let entity = await this.userRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      entity = UserMapper.toUpdateEntity(entity, dto);
      entity =  await this.userRepository.save(entity);
      return UserMapper.toDto(entity);
    } catch (error) { 
      throw new BadRequestException(error?.message);
    }
  }

  public async remove(id: number): Promise<UserResponseDto> {
    try {
      let entity = await this.userRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.userRepository.softDelete(id);
      return UserMapper.toDto(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
