import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchRequestDto } from './dto/create-branch-request.dto';
import { UpdateBranchRequestDto } from './dto/update-branch-request.dto';
import { ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { BranchResponseDto } from './dto/branch-response.dto';
import { ApiPaginatedResponse } from '@/common/paginations/api-paginated-response.decorator';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from '@/common/paginations/paginated-response.type';
import { BranchEntity } from './entities/branch.entity';

@ApiTags('Branch')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/branch',
  version: '1',
})
export class BranchController {
  constructor(private branchService: BranchService) {}

  @Post()
  @Permissions('create-branch')
  @ApiResponse({ status: 201, type: BranchResponseDto, description: 'Create branch successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public create(
    @Body() dto: CreateBranchRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<BranchResponseDto> {
    return this.branchService.create({ ...dto, createdbyId: user.id });
  }

  @Get()
  @Permissions('read-branch')
  @ApiPaginatedResponse(BranchResponseDto)
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<BranchEntity, BranchResponseDto>> {
    return this.branchService.list(query);
  }

  @Get('select-options')
  @ApiResponse({ status: 200, type: [Object], description: 'List all of branch for selection' })
  public findAllForSelection(): Promise<{ id: number; nameEn: string; nameKh: string }[]> {
    return this.branchService.findAllForSelection();
  }

  @Get(':id')
  @Permissions('read-branch')
  @ApiResponse({ status: 200, type: BranchResponseDto, description: 'Find one for branch' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found' })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<BranchResponseDto> {
    return this.branchService.findOne(id);
  }

  @Put(':id')
  @Permissions('update-branch')
  @ApiResponse({ status: 200, type: BranchResponseDto, description: 'Update branch successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found' })
  public update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBranchRequestDto) {
    return this.branchService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('delete-branch')
  @ApiResponse({ status: 200, type: BranchResponseDto, description: 'Find one for branch' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found' })
  public remove(@Param('id', ParseIntPipe) id: number) {
    return this.branchService.remove(id);
  }
}
