import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreatePurchaseReceiptItemRequestDto {
    @ApiProperty()
    @IsOptional()
    id?: number;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @ApiProperty()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    unitPrice: number;

    @ApiProperty()
    @IsNotEmpty()
    discount: number;

    @ApiProperty()
    @IsOptional()
    note?: string;
}