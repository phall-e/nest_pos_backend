import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { CreatePurchaseOrderRequestDto } from './dto/create-purchase-order-request.dto';
import { UpdatePurchaseOrderRequestDto } from './dto/update-purchase-order-request.dto';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PurchaseOrderResponseDto } from './dto/purchase-order-response.dto';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import { CancelPurchaseOrderRequestDto } from './dto/cancel-purchase-order-request.dto';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { PurchaseOrderEntity } from './entities/purchase-order.entity';

@ApiTags('Purchase Order')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/purchasing/purchase-order',
  version: '1',
})
export class PurchaseOrderController {
  constructor(private purchaseOrderService: PurchaseOrderService) {}

  @Post()
  @Permissions('create-purchase-order')
  @ApiResponse({ status: 201, type: PurchaseOrderResponseDto, description: 'Purchase order created successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreatePurchaseOrderRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<PurchaseOrderResponseDto> {
    return this.purchaseOrderService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Post('approve/:id')
  @Permissions('approve-purchase-order')
  @ApiResponse({ status: 200, type: PurchaseOrderResponseDto, description: 'Purchase Order approved successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public approve(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserEntity,
  ): Promise<PurchaseOrderResponseDto> {
    return this.purchaseOrderService.approve(id, user.id);
  }

  @Post('cancel/:id')
  @Permissions('cancel-purchase-order')
  @ApiResponse({ status: 200, type: PurchaseOrderResponseDto, description: 'Purchase Order canceled successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelPurchaseOrderRequestDto,
  ): Promise<PurchaseOrderResponseDto> {
    return this.purchaseOrderService.cancel(id, dto);
  }

  @Get()
  @Permissions('read-purchase-order')
  @ApiPaginatedResponse(PurchaseOrderResponseDto)
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<PurchaseOrderEntity, PurchaseOrderResponseDto>> {
    return this.purchaseOrderService.list(query);
  }

  @Get('next-code')
  @ApiResponse({ status: 200, type: String, description: 'Get next code for purchase order' })
  public nextCode(): Promise<string> {
    return this.purchaseOrderService.nextCode();
  }

  @Get('select-options/:branchId')
  @ApiResponse({ status: 200, type: Object, description: 'List all of purchase order for selection' })
  public findAllForSelection(@Param('branchId', ParseIntPipe) branchId: number): Promise<{ id: number; code: string}[]> {
    return this.purchaseOrderService.findAllForSelection(branchId);
  }

  @Get(':id')
  @Permissions('read-purchase-order')
  @ApiResponse({ status: 200, type: PurchaseOrderResponseDto, description: 'Find one of Purchase order' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<PurchaseOrderResponseDto> {
    return this.purchaseOrderService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-purchase-order')
  @ApiResponse({ status: 200, type: PurchaseOrderResponseDto, description: 'Purchase order updated successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdatePurchaseOrderRequestDto): Promise<PurchaseOrderResponseDto> {
    return this.purchaseOrderService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-purchase-order')
  @ApiResponse({ status: 200, type: PurchaseOrderResponseDto, description: 'Purchase order deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<PurchaseOrderResponseDto> {
    return this.purchaseOrderService.remove(id);
  }
}
