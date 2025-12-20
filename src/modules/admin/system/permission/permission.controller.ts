import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionRequestDto } from './dto/create-permission-request.dto';
import { UpdatePermissionRequestDto } from './dto/update-permission-request.dto';
import { ApiBasicAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { PermissionEntity } from './entities/permission.entity';
import { PermissionResponseDto } from './dto/permission-response.dto';
// import { PaginationParams } from '@/common/paginations/decorators/pagination-params.decorator';
// import { type PaginationRequest } from '@/common/paginations/interfaces';
import { PaginationResponseDto } from '@/common/paginations/pagination-response.dto';

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
  @ApiResponse({ status: 200, type: PaginationResponseDto<PermissionResponseDto>, description: 'List of all permissions' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    // return this.permissionService.list<PermissionEntity, PermissionResponseDto>(pagination);
  }

  @Get('select-options')
  @ApiResponse({ status: 200, type: [Object], description: 'List of roles for selection' })
  findAllForSelection(): Promise<{ id: number; name: string; description: string }[]> {
    return this.permissionService.findAllForSelection();
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
