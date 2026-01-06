import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { StockTransferService } from './stock-transfer.service';
import { CreateStockTransferRequestDto } from './dto/create-stock-transfer-request.dto';
import { UpdateStockTransferRequestDto } from './dto/update-stock-transfer-request.dto';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockTransferResponseDto } from './dto/stock-transfer-response.dto';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { StockTransferEntity } from './entities/stock-transfer.entity';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';

@ApiTags('Stock Transfer')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/stocking/stock-transfer',
  version: '1',
})
export class StockTransferController {
  constructor(private stockTransferService: StockTransferService) {}

  @Post()
  @Permissions('create-stock-transfer')
  @ApiResponse({ status: 201, type: StockTransferResponseDto, description: 'Stock transfer created successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateStockTransferRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<StockTransferResponseDto> {
    return this.stockTransferService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('read-stock-transfer')
  @ApiPaginatedResponse(StockTransferResponseDto)
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<StockTransferEntity, StockTransferResponseDto>> {
    return this.stockTransferService.list(query);
  }

  @Get(':id')
  @Permissions('read-stock-transfer')
  @ApiResponse({ status: 200, type: StockTransferResponseDto, description: 'Find one of stock transfer'})
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<StockTransferResponseDto> {
    return this.stockTransferService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-stock-transfer')
  @ApiResponse({ status: 200, type: StockTransferResponseDto, description: 'Stock transfer updated successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStockTransferRequestDto): Promise<StockTransferResponseDto> {
    return this.stockTransferService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-stock-transfer')
  @ApiResponse({ status: 200, type: StockTransferResponseDto, description: 'Stock transfer deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<StockTransferResponseDto> {
    return this.stockTransferService.remove(+id);
  }
}
