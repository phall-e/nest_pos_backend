import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { SalePaymentReceiptService } from './sale-payment-receipt.service';
import { CreateSalePaymentReceiptRequestDto } from './dto/create-sale-payment-receipt-request.dto';
import { UpdateSalePaymentReceiptRequestDto } from './dto/update-sale-payment-receipt-request.dto';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { SalePaymentReceiptResponseDto } from './dto/sale-payment-receipt-response.dto';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { SalePaymentReceiptEntity } from './entities/sale-payment-receipt.entity';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';

@ApiTags('Sale Payment Receipt')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/saling/sale-payment-receipt',
  version: '1'
})
export class SalePaymentReceiptController {
  constructor(private salePaymentReceiptService: SalePaymentReceiptService) {}

  @Post()
  @Permissions('create-sale-payment-receipt')
  @ApiResponse({ status: 201, type: SalePaymentReceiptResponseDto, description: 'Sale payment receipt created successfully'})
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateSalePaymentReceiptRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<SalePaymentReceiptResponseDto> {
    return this.salePaymentReceiptService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('read-sale-payment-receipt')
  @ApiPaginatedResponse(SalePaymentReceiptResponseDto)
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<SalePaymentReceiptEntity, SalePaymentReceiptResponseDto>> {
    return this.salePaymentReceiptService.list(query);
  }

  @Get('next-code')
  @ApiResponse({ status: 200, type: String, example: 'SRC2026000001', description: 'Get next code for sale payment receipt' })
  public nextCode(): Promise<string> {
    return this.salePaymentReceiptService.nextCode();
  }

  @Get(':id')
  @Permissions('read-sale-payment-receipt')
  @ApiResponse({ status: 200, type: SalePaymentReceiptResponseDto, description: 'Find one of sale payment receipt' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<SalePaymentReceiptResponseDto> {
    return this.salePaymentReceiptService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-sale-payment-receipt')
  @ApiResponse({ status: 200, type: SalePaymentReceiptResponseDto, description: 'Sale payment receipt updated successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSalePaymentReceiptRequestDto): Promise<SalePaymentReceiptResponseDto> {
    return this.salePaymentReceiptService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-sale-payment-receipt')
  @ApiResponse({ status: 200, type: SalePaymentReceiptResponseDto, description: 'Sale payment receipt deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<SalePaymentReceiptResponseDto> {
    return this.salePaymentReceiptService.remove(id);
  }
}
