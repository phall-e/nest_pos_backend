import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { UpdateRoleRequestDto } from './dto/update-role-request.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { ApiBasicAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
// import { PaginationParams } from '@/common/paginations/decorators/pagination-params.decorator';
// import { type PaginationRequest } from '@/common/paginations/interfaces';
import { PaginationResponseDto } from '@/common/paginations/pagination-response.dto';
import { RoleEntity } from './entities/role.entity';

@ApiTags('Roles')
@ApiBasicAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/system/roles',
  version: '1'
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Permissions('create-role')
  @ApiResponse({ status: 201, type: RoleResponseDto, description: 'Role created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() dto: CreateRoleRequestDto): Promise<RoleResponseDto> {
    return this.roleService.create(dto);
  }

  @Get()
  @Permissions('read-role')
  @ApiResponse({ status: 200, type: PaginationResponseDto<RoleResponseDto>, description: 'List of all roles' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    // return this.roleService.list<RoleEntity, RoleResponseDto>(pagination);
  }

  @Get('select-options')
  @ApiResponse({ status: 200, type: [Object], description: 'List of roles for selection' })
  findAllForSelection(): Promise<{ id: number; name: string }[]> {
    return this.roleService.findAllForSelection();
  }

  @Get(':id')
  @Permissions('read-role')
  @ApiResponse({ status: 200, type: RoleResponseDto, description: 'Role details' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<RoleResponseDto> {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-role')
  @ApiResponse({ status: 200, type: RoleResponseDto, description: 'Role updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: number, @Body() dto: UpdateRoleRequestDto): Promise<RoleResponseDto> {
    return this.roleService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-role')
  @ApiResponse({ status: 200, type: RoleResponseDto, description: 'Role deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<RoleResponseDto> {
    return this.roleService.remove(id);
  }
}
