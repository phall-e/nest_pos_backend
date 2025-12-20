import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put, Query } from '@nestjs/common';
import { UomService } from './uom.service';
import { CreateUomRequestDto } from './dto/create-uom-request.dto';
import { UpdateUomRequestDto } from './dto/update-uom-request.dto';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { UomResponseDto } from './dto/uom-response.dto';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { UomEntity } from './entities/uom.entity';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';

@ApiTags('Uom')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/uom',
  version: '1',
})
export class UomController {
  constructor(private readonly uomService: UomService) {}

  @Post()
  @Permissions('create-uom')
  @ApiResponse({ status: 201, type: UomResponseDto, description: 'Create Uom' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateUomRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<UomResponseDto> {
    return this.uomService.create({ ...dto, createdById: user.id });
  }

  @Get()
  @Permissions('read-uom')
  @ApiPaginatedResponse(UomResponseDto)
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<UomEntity, UomResponseDto>> {
    return this.uomService.list(query);
  }

  @Get('select-options')
  @ApiResponse({ status: 200, type: [Object], description: 'List of uom for selection' })
  public findAllForSelection(): Promise<{ id: number; nameEn: string; nameKh: string }[]> {
    return this.uomService.findAllForSelection();
  }

  @Get(':id')
  @Permissions('read-uom')
  @ApiResponse({ status: 200, type: UomResponseDto, description: 'Find one Uom' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<UomResponseDto> {
    return this.uomService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-uom')
  @ApiResponse({ status: 200, type: UomResponseDto, description: 'Uom updated successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateUomRequestDto
  ): Promise<UomResponseDto> {
    return this.uomService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-uom')
  @ApiResponse({ status: 200, type: UomResponseDto, description: 'Delete uom successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id', ParseIntPipe) id: number) {
    return this.uomService.remove(id);
  }
}
