import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { PurchaseReceiptBillingService } from './purchase-receipt-billing.service';
import { CreatePurchaseReceiptBillingRequestDto } from './dto/create-purchase-receipt-billing-request.dto';
import { UpdatePurchaseReceiptBillingRequestDto } from './dto/update-purchase-receipt-billing-request.dto';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { PurchaseReceiptBillingResponseDto } from './dto/purchase-receipt-billing-response.dto';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { PurchaseReceiptBillingEntity } from './entities/purchase-receipt-billing.entity';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';

@ApiTags('Purchase Receipt Billing')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/purchasing/purchase-receipt-billing',
  version: '1'
})
export class PurchaseReceiptBillingController {
  constructor(private purchaseReceiptBillingService: PurchaseReceiptBillingService) {}

  @Post()
  @Permissions('create-purchase-receipt-billing')
  @ApiResponse({ status: 201, type: PurchaseReceiptBillingResponseDto, description: 'Purchase receipt billing created successfully'})
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreatePurchaseReceiptBillingRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<PurchaseReceiptBillingResponseDto> {
    return this.purchaseReceiptBillingService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('read-purchase-receipt-billing')
  @ApiPaginatedResponse(PurchaseReceiptBillingResponseDto)
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<PurchaseReceiptBillingEntity, PurchaseReceiptBillingResponseDto>> {
    return this.purchaseReceiptBillingService.list(query);
  }

  @Get('next-code')
  @ApiResponse({ status: 200, type: String, example: 'PRB26000001', description: 'Get next code for purchase receipt billing' })
  public nextCode(): Promise<string> {
    return this.purchaseReceiptBillingService.nextCode();
  }

  @Get(':id')
  @Permissions('read-purchase-receipt-billing')
  @ApiResponse({ status: 200, type: PurchaseReceiptBillingResponseDto, description: 'Find one of purchase receipt billing' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<PurchaseReceiptBillingResponseDto> {
    return this.purchaseReceiptBillingService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-purchase-receipt-billing')
  @ApiResponse({ status: 200, type: PurchaseReceiptBillingResponseDto, description: 'Purchase receipt billing updated successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePurchaseReceiptBillingRequestDto): Promise<PurchaseReceiptBillingResponseDto> {
    return this.purchaseReceiptBillingService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-purchase-receipt-billing')
  @ApiResponse({ status: 200, type: PurchaseReceiptBillingResponseDto, description: 'Purchase receipt billing deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<PurchaseReceiptBillingResponseDto> {
    return this.purchaseReceiptBillingService.remove(id);
  }
}
