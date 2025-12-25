import { ApiProperty } from "@nestjs/swagger";
import { ProductResponseDto } from "../../product/dto/product-response.dto";
import { BranchResponseDto } from "../../branch/dto/branch-response.dto";
import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";

export class ProductsByBranchesResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    productId: number;

    @ApiProperty()
    product: ProductResponseDto;

    @ApiProperty()
    branchId: number;

    @ApiProperty()
    branch: BranchResponseDto;

    @ApiProperty()
    salePrice: number;

    @ApiProperty()
    note: string;

    @ApiProperty()
    createdById: number;

    @ApiProperty()
    createdBy: UserResponseDto;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}