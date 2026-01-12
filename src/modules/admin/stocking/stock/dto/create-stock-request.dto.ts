import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateStockRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    branchId: number;

    @ApiProperty()
    @IsNotEmpty()
    productId: number;

    @ApiProperty()
    @IsOptional()
    minStock?: number;

    @ApiProperty()
    @IsOptional()
    stockIn?: number;

    @ApiProperty()
    @IsOptional()
    stockAdjustment?: number;

    @ApiProperty()
    @IsOptional()
    stockTransfer?: number;

    @ApiProperty()
    @IsOptional()
    stockOut?: number;

    createdById: number;
}
