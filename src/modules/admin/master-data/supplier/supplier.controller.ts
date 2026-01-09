import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierRequestDto } from './dto/create-supplier-request.dto';
import { UpdateSupplierRequestDto } from './dto/update-supplier-request.dto';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { SupplierResponseDto } from './dto/supplier-response.dto';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { SupplierEntity } from './entities/supplier.entity';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';

@ApiTags('Supplier')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/supplier'
})
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @Permissions('create-supplier')
  @ApiResponse({ status: 201, type: SupplierResponseDto, description: 'Supplier created successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateSupplierRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<SupplierResponseDto> {
    return this.supplierService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('read-supplier')
  @ApiPaginatedResponse(SupplierResponseDto)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<SupplierEntity, SupplierResponseDto>> {
    return this.supplierService.list(query);
  }

  @Get('next-code')
  @ApiResponse({ status: 200, type: String, description: 'Get next code for supplier' })
  public nextCode(): Promise<string> {
    return this.supplierService.nextCode();
  }

  @Get('select-options')
  @ApiResponse({ status: 200, type: [Object], description: 'List all supplier for selection' })
  public findAllForSelections(): Promise<{ id: number; code: string; nameEn: string; nameKh: string }[]> {
    return this.supplierService.findAllForSelection();
  }

  @Get(':id')
  @Permissions('read-supplier')
  @ApiResponse({ status: 200, type: SupplierResponseDto, description: 'Find one of supplier' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<SupplierResponseDto> {
    return this.supplierService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-supplier')
  @ApiResponse({ status: 200, type: SupplierResponseDto, description: 'Supplier updated successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSupplierRequestDto): Promise<SupplierResponseDto> {
    return this.supplierService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-supplier')
  @ApiResponse({ status: 200, type: SupplierResponseDto, description: 'Supplier deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<SupplierResponseDto> {
    return this.supplierService.remove(+id);
  }
}
