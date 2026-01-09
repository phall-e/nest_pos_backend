import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ProductResponseDto } from './dto/product-response.dto';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductRequestDto } from './dto/update-product-request.dto';

@ApiTags('Products')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/product',
  version: '1',
})
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Permissions('create-product')
  @ApiResponse({ status: 201, type: ProductResponseDto, description: 'Product created successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateProductRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<ProductResponseDto> {
    return this.productService.create({ ...dto, createdById: user.id });
  }

  @Get()
  @Permissions('read-product')
  @ApiPaginatedResponse(ProductResponseDto)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<ProductEntity, ProductResponseDto>> {
    return this.productService.list(query);
  }

  @Get('next-code')
  @ApiResponse({ status: 200, type: String, description: 'Get next code for product' })
  public nextCode(): Promise<string> {
    return this.productService.nextCode();
  }


  @Get('select-options')
  @ApiResponse({ status: 200, type: [Object], description: 'List of products for selection' })
  public findAllForSelection(): Promise<{ id: number; code: string; nameEn: string; nameKh: string }[]> {
    return this.productService.findAllForSelection();
  }

  @Get(':id')
  @Permissions('read-product')
  @ApiResponse({ status: 200, type: ProductResponseDto, description: 'Find one of product' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-product')
  @ApiResponse({ status: 200, type: ProductResponseDto, description: 'Update product successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductRequestDto): Promise<ProductResponseDto> {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-product')
  @ApiResponse({ status: 200, type: ProductResponseDto, description: 'Delete product successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    return this.productService.remove(id);
  }
}
