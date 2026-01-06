import { ProductResponseDto } from "@/modules/admin/master-data/product/dto/product-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { StockTransferResponseDto } from "./stock-transfer-response.dto";

export class StockTransferItemResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    stockTransferId: number;

    @ApiProperty()
    stockTransfer: StockTransferResponseDto;

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