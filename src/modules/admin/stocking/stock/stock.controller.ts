import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockRequestDto } from './dto/create-stock-request.dto';
import { UpdateStockRequestDto } from './dto/update-stock-request.dto';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { StockResponseDto } from './dto/stock-response.dto';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { StockEntity } from './entities/stock.entity';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';

@ApiTags('Stock')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/stocking/stock',
  version: '1',
})
export class StockController {
  constructor(private stockService: StockService) {}

  @Post()
  @Permissions('create-stock')
  @ApiResponse({ status: 201, type: StockResponseDto, description: 'Stock is created successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateStockRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<StockResponseDto> {
    return this.stockService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('read-stock')
  @ApiPaginatedResponse(StockResponseDto)
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<StockEntity, StockResponseDto>> {
    return this.stockService.list(query);
  }

  @Get(':id')
  @Permissions('read-stock')
  @ApiResponse({ status: 200, type: StockResponseDto, description: 'Find one of stock' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<StockResponseDto> {
    return this.stockService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-stock')
  @ApiResponse({ status: 200, type: StockResponseDto, description: 'Stock is updated successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateStockRequestDto
  ): Promise<StockResponseDto> {
    return this.stockService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-stock')
  @ApiResponse({ status: 200, type: StockResponseDto, description: 'Stock is deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<StockResponseDto> {
    return this.stockService.remove(id);
  }
}
