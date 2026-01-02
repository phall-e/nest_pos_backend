import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { StockInService } from './stock-in.service';
import { CreateStockInRequestDto } from './dto/create-stock-in-request.dto';
import { UpdateStockInRequestDto } from './dto/update-stock-in-request.dto';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { StockInResponseDto } from './dto/stock-in-response.dto';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { StockInEntity } from './entities/stock-in.entity';

@ApiTags('Stock In')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/stocking/stock-in',
  version: '1',
})
export class StockInController {
  constructor(private stockInService: StockInService) {}

  @Post()
  @Permissions('create-stock-in')
  @ApiResponse({ status: 201, type: [StockInResponseDto], description: 'Stock in is created successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateStockInRequestDto, 
    @CurrentUser() user: UserEntity,
  ): Promise<StockInResponseDto[]> {
    return this.stockInService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('read-stock-in')
  @ApiPaginatedResponse(StockInResponseDto)
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<StockInEntity, StockInResponseDto>> {
    return this.stockInService.list(query);
  }

  @Get(':id')
  @Permissions('read-stock-in')
  @ApiResponse({ status: 200, type: StockInResponseDto, description: 'Find one of stock in' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<StockInResponseDto> {
    return this.stockInService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-stock-in')
  @ApiResponse({ status: 200, type: StockInResponseDto, description: 'Stock updated successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStockInRequestDto): Promise<StockInResponseDto> {
    return this.stockInService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-stock-in')
  @ApiResponse({ status: 200, type: StockInResponseDto, description: 'Stock in deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<StockInResponseDto> {
    return this.stockInService.remove(id);
  }
}
