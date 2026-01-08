import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserMapper } from './user.mapper';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import * as bcrypt from 'bcrypt';
import { PasswordHash } from '@/utils/password-hash.util';

@Injectable()
export class UserService extends BasePaginationCrudService<UserEntity, UserResponseDto>{
  protected SORTABLE_COLUMNS = ['id', 'username', 'isAdmin', 'isActive'];
  protected FILTER_COLUMNS = ['username', 'isAdmin', 'isActive'];
  protected SEARCHABLE_COLUMNS = ['username', 'isAdmin', 'isActive'];
  protected RELATIONSIP_FIELDS = ['branches'];

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ){
    super()
  }

  protected get repository(): Repository<UserEntity> {
    return this.userRepository;
  } 

  protected getMapperReponseEntityField(entities: UserEntity): Promise<UserResponseDto> {
    return UserMapper.toDtoWithRelationship(entities);
  }

  public async create(dto: CreateUserRequestDto): Promise<UserResponseDto> {
    try {
      let entity = await UserMapper.toCreateEntity({
        ...dto,
        password: await PasswordHash.hash(dto.password),
      });
      entity = await this.userRepository.save(entity);
      await this.userRepository
        .createQueryBuilder()
        .relation(UserEntity, 'branches')
        .of(entity)
        .add(dto.branch);
      await this.userRepository
        .createQueryBuilder()
        .relation(UserEntity, 'roles')
        .of(entity)
        .add(dto.roles);
      return UserMapper.toDtoWithRelationship(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
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
      });
      console.log(entity);
      if (!entity) throw new NotFoundException();
      return UserMapper.toDtoWithRelationship(entity);
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
      return UserMapper.toDtoWithRelationship(entity);
    } catch (error) { 
      throw new BadRequestException(error?.message);
    }
  }

  public async remove(id: number): Promise<UserResponseDto> {
    try {
      let entity = await this.userRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.userRepository.softDelete(id);
      return UserMapper.toDtoWithRelationship(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
