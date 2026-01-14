import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { CustomerTypeService } from './customer-type.service';
import { CreateCustomerTypeRequestDto } from './dto/create-customer-type-request.dto';
import { UpdateCustomerTypeRequestDto } from './dto/update-customer-type-request.dto';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { CustomerTypeResponseDto } from './dto/customer-type-response.dto';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { CustomerTypeEntity } from './entities/customer-type.entity';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';

@ApiTags('Customer Type')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/customer-type',
  version: '1',
})
export class CustomerTypeController {
  constructor(private customerTypeService: CustomerTypeService) {}

  @Post()
  @Permissions('create-customer-type')
  @ApiResponse({ status: 201, type: CustomerTypeResponseDto, description: 'Customer type created successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateCustomerTypeRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<CustomerTypeResponseDto> {
    return this.customerTypeService.create({ ...dto, createdById: user.id });
  }

  @Get()
  @Permissions('read-customer-type')
  @ApiPaginatedResponse(CustomerTypeResponseDto)
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<CustomerTypeEntity, CustomerTypeResponseDto>> {
    return this.customerTypeService.list(query);
  }

  @Get('select-options')
  @ApiResponse({ status: 200, type: [Object], description: 'List of customer for selection' })
  public findAllForSelection(): Promise<{ id: number; nameEn: string; nameKh: string }[]> {
    return this.customerTypeService.findAllForSelection();
  }

  @Get(':id')
  @Permissions('read-customer-type')
  @ApiResponse({ status: 200, type: CustomerTypeResponseDto, description: 'Find one customer type' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<CustomerTypeResponseDto> {
    return this.customerTypeService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-customer-type')
  @ApiResponse({ status: 200, type: CustomerTypeResponseDto, description: 'Customer type updated successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateCustomerTypeRequestDto
  ): Promise<CustomerTypeResponseDto> {
    return this.customerTypeService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-customer-type')
  @ApiResponse({ status: 200, type: CustomerTypeResponseDto, description: 'Delete customer type successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id', ParseIntPipe) id: number) {
    return this.customerTypeService.remove(id);
  }
}
