import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { SaleAttachment } from "./attachement.dto";
import { Type } from "class-transformer";
import { CreateSaleItemRequestDto } from "./create-sale-item-request.dto";

export class CreateSaleRequestDto {
    @ApiProperty()
    @IsOptional()
    code?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    saleDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    branchId: number;

    @ApiProperty()
    @IsNotEmpty()
    customerId: number;

    @ApiProperty()
    @IsNotEmpty()
    soleById: number;

    @ApiProperty()
    @IsNotEmpty()
    totalQuantity: number;

    @ApiProperty()
    @IsNotEmpty()
    totalDiscount: number;

    @ApiProperty()
    @IsNotEmpty()
    totalAmount: number;

    @ApiProperty()
    @IsNotEmpty()
    totalPaidAmount: number;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    attachments: SaleAttachment[];

    @ApiProperty()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsNotEmpty()
    status: string;

    createdById: number;

    @ApiProperty({ type: [CreateSaleItemRequestDto] })
    @ValidateNested({ each: true })
    @Type(() => CreateSaleItemRequestDto)
    @ArrayMinSize(1)
    items: CreateSaleItemRequestDto[];
}
