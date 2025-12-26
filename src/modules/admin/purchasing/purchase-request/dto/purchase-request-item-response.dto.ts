import { ProductResponseDto } from "@/modules/admin/master-data/product/dto/product-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class PurchaseRequestItemResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    purchaseRequestId: number;

    @ApiProperty()
    productId: number;

    @ApiProperty()
    product: ProductResponseDto;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    note: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date; 
}