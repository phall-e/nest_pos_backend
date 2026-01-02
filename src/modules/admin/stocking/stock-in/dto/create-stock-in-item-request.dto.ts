import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export class CreateStockInItemRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    purchaseReceiptId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    branchId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0.1)
    quantity: number;

    @ApiProperty()
    @IsOptional()
    note?: string;
}