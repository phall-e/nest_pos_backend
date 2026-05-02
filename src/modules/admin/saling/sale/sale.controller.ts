import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put, ParseBoolPipe, Query, ParseDatePipe } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleRequestDto } from './dto/create-sale-request.dto';
import { UpdateSaleRequestDto } from './dto/update-sale-request.dto';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { SaleResponseDto } from './dto/sale-response.dto';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { SaleEntity } from './entities/sale.entity';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';

@ApiTags('Sale')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/saling/sale',
  version: '1'
})
export class SaleController {
  constructor(private saleService: SaleService) {}

  @Post()
  @Permissions('create-sale')
  @ApiResponse({ status: 201, type: SaleResponseDto, description: 'Sale created successfully'})
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateSaleRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<SaleResponseDto> {
    return this.saleService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('read-sale')
  @ApiPaginatedResponse(SaleResponseDto)
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<SaleEntity, SaleResponseDto>> {
    return this.saleService.list(query);
  }

  @Get('next-code')
  @ApiResponse({ status: 200, type: String, example: 'SL2026000001', description: 'Get next code for sale' })
  public nextCode(): Promise<string> {
    return this.saleService.nextCode();
  }

  @Get('summary-by-year')
  @ApiResponse({ status: 200, type: String, description: 'Summary saling data by year' })
  public summaryByYear(@Query('year') year: string) {
    const date = new Date(`${year}-01-01`);
    return this.saleService.summaryByYear(date);
  }

  @Get('select-options/:branchId/:isAll')
  @ApiResponse({ 
    status: 200,
    schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        code: { type: 'string', example: 'SL2026000001' },
      },
    },
  },
    description: 'Selection for sale' 
  })
  public findAllForSelection(
    @Param('branchId', ParseIntPipe) branchId: number,
    @Param('isAll') isAll: boolean,
  ): Promise<{ id: number; code: string }[]> {
    return this.saleService.findAllForSelection(branchId, isAll);
  }

  @Get(':id')
  @Permissions('read-sale')
  @ApiResponse({ status: 200, type: SaleResponseDto, description: 'Find one of sale' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<SaleResponseDto> {
    return this.saleService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-sale')
  @ApiResponse({ status: 200, type: SaleResponseDto, description: 'Sale updated successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSaleRequestDto): Promise<SaleResponseDto> {
    return this.saleService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('delete-sale')
  @ApiResponse({ status: 200, type: SaleResponseDto, description: 'Sale deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<SaleResponseDto> {
    return this.saleService.remove(id);
  }
}
