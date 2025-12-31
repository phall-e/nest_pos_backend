import { ProductResponseDto } from "@/modules/admin/master-data/product/dto/product-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { PurchaseReceiptResponseDto } from "./purchase-receipt-response.dto";

export class PurchaseReceiptItemResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    purchaseReceiptId: number;

    @ApiProperty()
    purchaseReceipt: PurchaseReceiptResponseDto;

    @ApiProperty()
    productId: number;

    @ApiProperty()
    product: ProductResponseDto;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    unitPrice: number;

    @ApiProperty()
    discount: number;

    @ApiProperty()
    note: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}