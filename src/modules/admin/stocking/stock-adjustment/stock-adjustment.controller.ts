import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { StockAdjustmentService } from './stock-adjustment.service';
import { CreateStockAdjustmentRequestDto } from './dto/create-stock-adjustment-request.dto';
import { UpdateStockAdjustmentRequestDto } from './dto/update-stock-adjustment-request.dto';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { StockAdjustmentResponseDto } from './dto/stock-adjustment-response.dto';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { StockAdjustmentEntity } from './entities/stock-adjustment.entity';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';

@ApiTags('Stock Adjustment')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/stocking/stock-adjustment',
  version: '1',
})
export class StockAdjustmentController {
  constructor(private stockAdjustmentService: StockAdjustmentService) {}

  @Post()
  @Permissions('create-stock-adjustment')
  @ApiResponse({ status: 201, type: StockAdjustmentResponseDto })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateStockAdjustmentRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<StockAdjustmentResponseDto> {
    return this.stockAdjustmentService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('read-stock-adjustment')
  @ApiPaginatedResponse(StockAdjustmentResponseDto)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<StockAdjustmentEntity, StockAdjustmentResponseDto>> {
    return this.stockAdjustmentService.list(query);
  }

  @Get(':id')
  @Permissions('read-stock-adjustment')
  @ApiResponse({ status: 200, type: StockAdjustmentResponseDto, description: 'Find one of stock adjustment' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<StockAdjustmentResponseDto> {
    return this.stockAdjustmentService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-stock-adjustment')
  @ApiResponse({ status: 200, type: StockAdjustmentResponseDto, description: 'Stock adjustment updated successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateStockAdjustmentRequestDto): Promise<StockAdjustmentResponseDto> {
    return this.stockAdjustmentService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-stock-adjustment')
  @ApiResponse({ status: 200, type: StockAdjustmentResponseDto, description: 'Stock adjustment deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id') id: number): Promise<StockAdjustmentResponseDto> {
    return this.stockAdjustmentService.remove(+id);
  }
}
