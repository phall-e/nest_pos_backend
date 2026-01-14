import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerRequestDto } from './dto/create-customer-request.dto';
import { UpdateCustomerRequestDto } from './dto/update-customer-request.dto';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { CustomerEntity } from './entities/customer.entity';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';

@ApiTags('Customer')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/customer'
})
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  @Permissions('create-customer')
  @ApiResponse({ status: 201, type: CustomerResponseDto, description: 'Customer created successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateCustomerRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<CustomerResponseDto> {
    return this.customerService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('read-customer')
  @ApiPaginatedResponse(CustomerResponseDto)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<CustomerEntity, CustomerResponseDto>> {
    return this.customerService.list(query);
  }

  @Get('next-code')
  @ApiResponse({ status: 200, type: String, description: 'Get next code for customer' })
  public nextCode(): Promise<string> {
    return this.customerService.nextCode();
  }

  @Get('select-options')
  @ApiResponse({ status: 200, type: [Object], description: 'List all customer for selection' })
  public findAllForSelections(): Promise<{ id: number; code: string; nameEn: string; nameKh: string }[]> {
    return this.customerService.findAllForSelection();
  }

  @Get(':id')
  @Permissions('read-customer')
  @ApiResponse({ status: 200, type: CustomerResponseDto, description: 'Find one of customer' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<CustomerResponseDto> {
    return this.customerService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-customer')
  @ApiResponse({ status: 200, type: CustomerResponseDto, description: 'Customer updated successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCustomerRequestDto): Promise<CustomerResponseDto> {
    return this.customerService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-customer')
  @ApiResponse({ status: 200, type: CustomerResponseDto, description: 'Customer deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<CustomerResponseDto> {
    return this.customerService.remove(id);
  }
}
