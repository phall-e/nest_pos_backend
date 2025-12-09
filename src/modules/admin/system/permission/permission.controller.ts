import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionRequestDto } from './dto/create-permission-request.dto';
import { UpdatePermissionRequestDto } from './dto/update-permission-request.dto';
import { ApiBasicAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';

@ApiTags('Permissions')
@ApiBasicAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/system/permissions',
  version: '1',
})
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Permissions('create-permission')
  @ApiResponse({ status: 201, description: 'Permission created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() dto: CreatePermissionRequestDto) {
    return this.permissionService.create(dto);
  }

  @Get()
  @Permissions('read-permission')
  @ApiResponse({ status: 200, description: 'List of all permissions' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @Permissions('read-permission')
  @ApiResponse({ status: 200, description: 'Permission details' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-permission')
  @ApiResponse({ status: 200, description: 'Permission updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePermissionRequestDto) {
    return this.permissionService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-permission')
  @ApiResponse({ status: 200, description: 'Permission deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.remove(+id);
  }
}
