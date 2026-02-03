import { ApiProperty } from "@nestjs/swagger";
import { SaleResponseDto } from "./sale-response.dto";
import { ProductResponseDto } from "@/modules/admin/master-data/product/dto/product-response.dto";
import { IsOptional } from "class-validator";

export class SaleItemResponseDto {
    @ApiProperty()
    @IsOptional()
    id?: number;

    @ApiProperty()
    saleId: number;

    @ApiProperty()
    sale: SaleResponseDto;

    @ApiProperty()
    productId: number;

    @ApiProperty()
    product: ProductResponseDto;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    discount: number;

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