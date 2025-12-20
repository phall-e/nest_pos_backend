import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryRequestDto } from './dto/create-category-request.dto';
import { UpdateCategoryRequestDto } from './dto/update-category-request.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { CategoryResponseDto } from './dto/category-response.dto';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { CategoryEntity } from './entities/category.entity';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';

@ApiTags('Categories')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/category',
  version: '1'
})
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @Permissions('create-category')
  @ApiResponse({ status: 201, type: CategoryResponseDto, description: 'Category created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  public create(
    @Body() dto: CreateCategoryRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.create({...dto, createdById: user.id});
  }

  @Get()
  @Permissions('read-category')
  @ApiPaginatedResponse(CategoryResponseDto)
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<CategoryEntity, CategoryResponseDto>> {
    return this.categoryService.list(query);
  }

  @Get('select-options')
  @ApiResponse({ status: 200, type: [Object], description: 'List of categories for selection' })
  public findAllForSelection(): Promise<{ id: number; nameEn: string; nameKh: string }[]> {
    return this.categoryService.findAllForSelection();
  }

  @Get(':id')
  @Permissions('read-category')
  @ApiResponse({ status: 200, type: CategoryResponseDto, description: 'Find one of category' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-category')
  @ApiResponse({ status: 200, type: CategoryResponseDto, description: 'Update category' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  public update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateCategoryRequestDto): Promise<CategoryResponseDto>
  {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-category')
  @ApiResponse({ status: 200, type: CategoryResponseDto, description: 'Delete category' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  public remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
