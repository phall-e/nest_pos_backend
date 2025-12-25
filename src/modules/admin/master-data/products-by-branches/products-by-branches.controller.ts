import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { ProductsByBranchesService } from './products-by-branches.service';
import { CreateProductsByBranchRequestDto } from './dto/create-products-by-branch-request.dto';
import { UpdateProductsByBranchRequestDto } from './dto/update-products-by-branch-request.dto';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ProductsByBranchesResponseDto } from './dto/products-by-branches-response.dto';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { ProductsByBranchesEntity } from './entities/products-by-branch.entity';

@ApiTags('Products By Branches')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/products-by-branches',
  version: '1',
})
export class ProductsByBranchesController {
  constructor(private productsByBranchesService: ProductsByBranchesService) {}

  @Post()
  @Permissions('create-product-by-branch')
  @ApiResponse({ status: 201, type: ProductsByBranchesResponseDto, description: 'Create Product By Branch' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateProductsByBranchRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<ProductsByBranchesResponseDto> {
    return this.productsByBranchesService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('read-products-by-branches')
  @ApiPaginatedResponse(ProductsByBranchesResponseDto)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<ProductsByBranchesEntity, ProductsByBranchesResponseDto>> {
    return this.productsByBranchesService.list(query);
  }

  @Get('select-options/:branchId')
  @ApiResponse({ status: 200, type: [ProductsByBranchesResponseDto], description: 'List of product by branch for selection' })
  public findAllForSelection(@Param('branchId', ParseIntPipe) branchId: number): Promise<any[]> {
    return this.productsByBranchesService.findAllForSelection(branchId);
  }

  @Get(':id')
  @Permissions('read-products-by-branches')
  @ApiResponse({ status: 200, type: ProductsByBranchesResponseDto, description: 'Find one of product by branch' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductsByBranchesResponseDto> {
    return this.productsByBranchesService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-products-by-branches')
  @ApiResponse({ status: 200, type: ProductsByBranchesResponseDto, description: 'Update product by branch successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductsByBranchRequestDto): Promise<ProductsByBranchesResponseDto> {
    return this.productsByBranchesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-products-by-branches')
  @ApiResponse({ status: 200, type: ProductsByBranchesResponseDto, description: 'Delete product by branch successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<ProductsByBranchesResponseDto> {
    return this.productsByBranchesService.remove(id);
  }
}
