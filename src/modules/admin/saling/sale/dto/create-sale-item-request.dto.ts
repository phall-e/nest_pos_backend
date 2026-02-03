import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateSaleItemRequestDto {
    @ApiProperty()
    @IsOptional()
    id?: number;
    
    @ApiProperty()
    @IsNotEmpty()
    productId: number;

    @ApiProperty()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    discount: number;

    @ApiProperty()
    @IsNotEmpty()
    unitPrice: number;

    @ApiProperty()
    @IsOptional()
    note?: string;
}