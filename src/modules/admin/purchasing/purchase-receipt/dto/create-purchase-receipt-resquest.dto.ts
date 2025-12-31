import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { PurchaseReceiptAttachment } from "./attachement.dto";
import { CreatePurchaseReceiptItemRequestDto } from "./create-purchase-receipt-item-request.dto";
import { Type } from "class-transformer";

export class CreatePurchaseReceiptRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    receiptDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    purchaseOrderId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    branchId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    supplierId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    receiptRef: string;

    @ApiProperty()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    attachments: PurchaseReceiptAttachment[];

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    status: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    totalQuantity: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    totalAmount: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    totalNetAmount: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    totalDiscount: number;

    createdById: number;

    @ApiProperty({ type: [CreatePurchaseReceiptItemRequestDto] })
    @ValidateNested({ each: true })
    @Type(() => CreatePurchaseReceiptItemRequestDto)
    @ArrayMinSize(1)
    items: CreatePurchaseReceiptItemRequestDto[];
}
