import { ApiProperty } from "@nestjs/swagger";
import { PurchaseOrderResponseDto } from "./purchase-order-response.dto";
import { ProductResponseDto } from "@/modules/admin/master-data/product/dto/product-response.dto";

export class PurchaseOrderItemResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    purchaseOrderId: number;

    @ApiProperty()
    purchaseOrder: PurchaseOrderResponseDto;

    @ApiProperty()
    productId: number;

    @ApiProperty()
    product: ProductResponseDto;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    unitPrice: number;

    @ApiProperty()
    note: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}