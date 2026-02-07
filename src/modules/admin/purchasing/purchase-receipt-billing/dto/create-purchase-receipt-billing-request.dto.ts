import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNotEmpty, IsOptional } from "class-validator";
import { PurchaseReceiptBillingAttachment } from "./attachement.dto";

export class CreatePurchaseReceiptBillingRequestDto {
    @ApiProperty()
    @IsOptional()
    code?: string;

    @ApiProperty()
    @IsNotEmpty()
    purchaseReceiptId: number;

    @ApiProperty()
    @IsNotEmpty()
    billingById: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    billingDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    amount: number;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    attachments: PurchaseReceiptBillingAttachment[];

    @ApiProperty()
    @IsOptional()
    note?: string;

    createdById: number;

}
