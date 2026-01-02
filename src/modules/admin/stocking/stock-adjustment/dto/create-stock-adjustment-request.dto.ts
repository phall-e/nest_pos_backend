import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { StockAdjustmentAttachment } from "./attachement.dto";
import { Type } from "class-transformer";
import { CreateStockAdjustmentItemRequestDto } from "./create-stock-adjustment-item-request.dto";

export class CreateStockAdjustmentRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    branchId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    adjustmentDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    attachments?: StockAdjustmentAttachment[];

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    totalQuantity: number;

    createdById: number;

    @ApiProperty({ type: [CreateStockAdjustmentItemRequestDto] })
    @ValidateNested({ each: true })
    @Type(() => CreateStockAdjustmentItemRequestDto)
    @ArrayMinSize(1)
    items: CreateStockAdjustmentItemRequestDto[];
}
