import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min, ValidateNested } from "class-validator";
import { StockTransferAttachment } from "./attachement.dto";
import { CreateStockTransferItemRequestDto } from "./create-stock-transfer-item-request.dto";
import { Type } from "class-transformer";

export class CreateStockTransferRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    transferDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    fromBranchId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    toBranchId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0.1)
    totalQuantity: number;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    attachments?: StockTransferAttachment[];

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(160)
    description: string;

    createdById: number;

    @ApiProperty({ type: [CreateStockTransferItemRequestDto] })
    @ValidateNested({ each: true })
    @Type(() => CreateStockTransferItemRequestDto )
    @ArrayMinSize(1)
    items: CreateStockTransferItemRequestDto[];
}
