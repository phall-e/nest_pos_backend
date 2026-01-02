import { ProductResponseDto } from "@/modules/admin/master-data/product/dto/product-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { StockAdjustmentResponseDto } from "./stock-adjustment-response.dto";

export class StockAdjustmentItemResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    stockAdjustmentId: number;

    @ApiProperty()
    stockAdjustment: StockAdjustmentResponseDto;

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