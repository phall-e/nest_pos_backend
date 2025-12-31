import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { PurchaseOrderAttachment } from "./attachement.dto";
import { CreatePurchaseOrderItemRequestDto } from "./create-purchase-order-item-request.dto";
import { Type } from "class-transformer";

export class CreatePurchaseOrderRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    orderDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    purchaseRequestId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    branchId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    supplierId: number;

    @ApiProperty()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    attachments?: PurchaseOrderAttachment[];

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

    createdById: number;

    @ApiProperty({ type: [CreatePurchaseOrderItemRequestDto] })
    @ValidateNested({ each: true })
    @Type(() => CreatePurchaseOrderItemRequestDto)
    @ArrayMinSize(1)
    items: CreatePurchaseOrderItemRequestDto[];

}
