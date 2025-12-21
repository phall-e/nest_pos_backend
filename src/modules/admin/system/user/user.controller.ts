import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ApiBearerAuth, ApiForbiddenResponse, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { UserEntity } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/system/users',
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Permissions('create-user')
  @ApiResponse({ status: 201, type: UserResponseDto, description: 'User created successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.userService.create(dto);
  }

  @Get()
  @Permissions('read-user')
  @ApiPaginatedResponse(UserResponseDto)
  public findAll(@Paginate() queery: PaginateQuery): Promise<PaginatedResponse<UserEntity, UserResponseDto>> {
    return this.userService.list(queery);
  }

  @Get('select-options')
  @ApiResponse({ status: 200, type: [Object], description: 'List of users for selection' })
  public findAllForSelection(): Promise<{ id: number; username: string }[]> {
    return this.userService.findAllForSelection();
  }

  @Get(':id')
  @Permissions('read-user')
  @ApiResponse({ status: 200, type: UserResponseDto, description: 'User details' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-user')
  @ApiResponse({ status: 200, type: UserResponseDto, description: 'User updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserRequestDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-user')
  @ApiResponse({ status: 200, type: UserResponseDto, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.userService.remove(id);
  }
}
