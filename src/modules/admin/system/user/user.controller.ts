import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import {type PaginationRequest } from '@/common/paginations/interfaces/pagination-request.interface';
import { PaginationParams } from '@/common/paginations/decorators/pagination-params.decorator';
import { PaginationResponseDto } from '@/common/paginations/pagination-response.dto';
import { UserEntity } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/system/users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Permissions('create-user')
  @ApiResponse({ status: 201, type: UserResponseDto, description: 'User created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.userService.create(dto);
  }

  @Get()
  @Permissions('read-user')
  @ApiResponse({ status: 200, type: [UserResponseDto], description: 'List of all users' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search users' })
  findAll(@PaginationParams() pagination: PaginationRequest): Promise<PaginationResponseDto<UserResponseDto>> {
    return this.userService.list<UserEntity, UserResponseDto>(pagination);
  }

  @Get('select-options')
  @ApiResponse({ status: 200, type: [Object], description: 'List of users for selection' })
  findAllForSelection(): Promise<{ id: number; username: string }[]> {
    return this.userService.findAllForSelection();
  }

  @Get(':id')
  @Permissions('read-user')
  @ApiResponse({ status: 200, type: UserResponseDto, description: 'User details' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-user')
  @ApiResponse({ status: 200, type: UserResponseDto, description: 'User updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserRequestDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-user')
  @ApiResponse({ status: 200, type: UserResponseDto, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.userService.remove(id);
  }
}
