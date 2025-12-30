import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { PurchaseRequestService } from './purchase-request.service';
import { CreatePurchaseRequestRequestDto } from './dto/create-purchase-request-request.dto';
import { UpdatePurchaseRequestRequestDto } from './dto/update-purchase-request.dto';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PurchaseRequestResponseDto } from './dto/purchase-request-response.dto';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { PurchaseRequestEntity } from './entities/purchase-request.entity';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';

@ApiTags('Purchase Request')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/purchasing/purchase-request',
  version: '1',
})
export class PurchaseRequestController {
  constructor(private purchaseRequestService: PurchaseRequestService) {}

  @Post()
  @Permissions('create-purchase-request')
  @ApiResponse({ status: 201, type: PurchaseRequestResponseDto, description: 'Create Purchase Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreatePurchaseRequestRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<PurchaseRequestResponseDto> {
    return this.purchaseRequestService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Post(':id')
  @Permissions('approve-purchase-request')
  @ApiResponse({ status: 200, type: PurchaseRequestResponseDto, description: 'Purchase request is approved' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public approve(
    @Param('id', ParseIntPipe) id: number, 
    @CurrentUser() user: UserEntity
  ): Promise<PurchaseRequestResponseDto>{
    return this.purchaseRequestService.approve(id, user.id);
  }

  @Get()
  @Permissions('read-purchase-request')
  @ApiPaginatedResponse(PurchaseRequestResponseDto)
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<PurchaseRequestEntity, PurchaseRequestResponseDto>> {
    return this.purchaseRequestService.list(query);
  }

  @Get('next-code')
  @ApiResponse({ status: 200, type: String, description: 'Get next code for purchase request' })
  public nextCode(): Promise<string> {
    return this.purchaseRequestService.nextCode();
  }

  @Get('select-options/:branchId')
  @ApiResponse({ status: 200, type: Object, description: 'List all of purchase request for selection' })
  public findAllForSelection(@Param('branchId', ParseIntPipe) branchId: number): Promise<{ id: number; code: string}[]> {
    return this.purchaseRequestService.findAllForSelection(branchId);
  }

  @Get(':id')
  @Permissions('read-purchase-request')
  @ApiResponse({ status: 200, type: PurchaseRequestResponseDto, description: 'Find one of Purchase request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<PurchaseRequestResponseDto> {
    return this.purchaseRequestService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-purchase-request')
  @ApiResponse({ status: 200, type: PurchaseRequestResponseDto, description: 'Purchase request updated successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdatePurchaseRequestRequestDto): Promise<PurchaseRequestResponseDto> {
    return this.purchaseRequestService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-purchase-request')
  @ApiResponse({ status: 200, type: PurchaseRequestResponseDto, description: 'Purchase request deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id') id: string) {
    return this.purchaseRequestService.remove(+id);
  }
}
