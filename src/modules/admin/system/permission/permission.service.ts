import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionRequestDto } from './dto/create-permission-request.dto';
import { UpdatePermissionRequestDto } from './dto/update-permission-request.dto';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { PermissionMapper } from './permission.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ){}
  public async create(dto: CreatePermissionRequestDto): Promise<PermissionResponseDto> {
    try {
      let entity = PermissionMapper.toCreateEntity(dto);
      entity = await this.permissionRepository.save(entity);
      return PermissionMapper.toDto(entity);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  public async findAll(): Promise<PermissionResponseDto[]> {
    try {
      const entities = await this.permissionRepository.find();
      return PermissionMapper.toDtoList(entities);
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
