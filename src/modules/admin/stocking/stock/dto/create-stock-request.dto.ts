import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateStockRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    branchId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    minStock?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    stockIn?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    stockAdjustment?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    stockTransfer?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    stockOut?: number;

    createdById: number;
}
