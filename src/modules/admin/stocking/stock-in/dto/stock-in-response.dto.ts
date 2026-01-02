import { BranchResponseDto } from "@/modules/admin/master-data/branch/dto/branch-response.dto";
import { ProductResponseDto } from "@/modules/admin/master-data/product/dto/product-response.dto";
import { PurchaseReceiptResponseDto } from "@/modules/admin/purchasing/purchase-receipt/dto/purchase-receipt-response.dto";
import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class StockInResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    purchaseReceiptId: number;

    @ApiProperty()
    purchaseReceipt: PurchaseReceiptResponseDto;

    @ApiProperty()
    branchId: number;

    @ApiProperty()
    branch: BranchResponseDto;

    @ApiProperty()
    productId: number;

    @ApiProperty()
    product: ProductResponseDto;

    @ApiProperty()
    quantity: number;

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