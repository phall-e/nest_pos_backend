import { BranchResponseDto } from "@/modules/admin/master-data/branch/dto/branch-response.dto";
import { ProductResponseDto } from "@/modules/admin/master-data/product/dto/product-response.dto";
import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class StockResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    branchId: number;

    @ApiProperty()
    branch: BranchResponseDto;

    @ApiProperty()
    productId: number;

    @ApiProperty()
    product: ProductResponseDto;

    @ApiProperty()
    minStock: number;

    @ApiProperty()
    stockIn: number;

    @ApiProperty()
    stockAdjustment: number;

    @ApiProperty()
    stockTransfer: number;

    @ApiProperty()
    stockOut: number;

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