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
    @IsNumber()
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    unitPrice: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    discount: number;

    @ApiProperty()
    @IsOptional()
    note?: string;
}