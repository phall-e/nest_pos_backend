import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export class CreateStockInItemRequestDto {
    @ApiProperty()
    @IsOptional()
    @IsDateString()
    stockInDate?: Date;

    @ApiProperty()
    @IsOptional()
    purchaseReceiptId?: number;

    @ApiProperty()
    @IsOptional()
    branchId?: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @ApiProperty()
    @IsNotEmpty()
    @Min(0.1)
    quantity: number;

    @ApiProperty()
    @IsOptional()
    note?: string;
}