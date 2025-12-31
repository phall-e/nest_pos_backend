import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { PurchaseReceiptService } from './purchase-receipt.service';
import { CreatePurchaseReceiptRequestDto } from './dto/create-purchase-receipt-resquest.dto';
import { UpdatePurchaseReceiptRequestDto } from './dto/update-purchase-receipt-request.dto';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { PurchaseReceiptResponseDto } from './dto/purchase-receipt-response.dto';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { CancelPurchaseReceiptRequestDto } from './dto/cancel-purchase-receipt-request.dto';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { PurchaseReceiptEntity } from './entities/purchase-receipt.entity';

@ApiTags('Purchase Receipt')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/purchasing/purchase-receipt',
})
export class PurchaseReceiptController {
  constructor(private purchaseReceiptService: PurchaseReceiptService) {}

  @Post()
  @Permissions('create-purchase-receipt')
  @ApiResponse({ status: 201, type: PurchaseReceiptResponseDto, description: 'Purchase receipt is created successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreatePurchaseReceiptRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<PurchaseReceiptResponseDto> {
    return this.purchaseReceiptService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Post('approve/:id')
  @Permissions('approve-purchase-receipt')
  @ApiResponse({ status: 200, type: PurchaseReceiptResponseDto, description: 'Purchase receipt is approved successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public approve(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: UserEntity): Promise<PurchaseReceiptResponseDto> {
    return this.purchaseReceiptService.approve(id, user.id);
  }

  @Post('cancel/:id')
  @Permissions('cancel-purchase-receipt')
  @ApiResponse({ status: 200, type: PurchaseReceiptResponseDto, description: 'Purchase receipt is canceled successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public cancel(@Param('id', ParseIntPipe) id: number, @Body() dto: CancelPurchaseReceiptRequestDto): Promise<PurchaseReceiptResponseDto> {
    return this.purchaseReceiptService.cancel(id, dto);
  }

  @Get()
  @Permissions('read-purchase-receipt')
  @ApiPaginatedResponse(PurchaseReceiptResponseDto)
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<PurchaseReceiptEntity, PurchaseReceiptResponseDto>> {
    return this.purchaseReceiptService.list(query);
  }

  @Get('next-code')
  @ApiResponse({ status: 200, example: 'PRC-2025-0000001', description: 'Get next code for purchase receipt' })
  public nextCode(): Promise<string> {
    return this.purchaseReceiptService.nextCode();
  }

  @Get('select-options/:branchId')
  @ApiResponse({ status: 200, type: Object, description: 'Find all for selection' })
  public findAllForSelection(@Param('branchId', ParseIntPipe) branchId: number): Promise<{ id: number; code: string}[]> {
    return this.purchaseReceiptService.findAllForSelection(branchId);
  }

  @Get(':id')
  @Permissions('read-purchase-receipt')
  @ApiResponse({ status: 200, type: PurchaseReceiptResponseDto, description: 'Find one for purchase receipt' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<PurchaseReceiptResponseDto> {
    return this.purchaseReceiptService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-purchase-receipt')
  @ApiResponse({ status: 200, type: PurchaseReceiptResponseDto, description: 'Purchase receipt is updated successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePurchaseReceiptRequestDto): Promise<PurchaseReceiptResponseDto> {
    return this.purchaseReceiptService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-purchase-receipt')
  @ApiResponse({ status: 200, type: PurchaseReceiptResponseDto, description: 'Purchase receipt is deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<PurchaseReceiptResponseDto> {
    return this.purchaseReceiptService.remove(id);
  }
}
