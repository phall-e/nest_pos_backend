import { PartialType } from '@nestjs/swagger';
import { CreateProductsByBranchRequestDto } from './create-products-by-branch-request.dto';

export class UpdateProductsByBranchRequestDto extends PartialType(CreateProductsByBranchRequestDto) {}
