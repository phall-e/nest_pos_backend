import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { SalePaymentReceiptAttachment } from "./attachement.dto";

export class CreateSalePaymentReceiptRequestDto {
    @ApiProperty()
    @IsOptional()
    code?: string;

    @ApiProperty()
    @IsNotEmpty()
    saleId: number;

    @ApiProperty()
    @IsNotEmpty()
    receiptById: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    receiptDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    amount: number;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    attachments: SalePaymentReceiptAttachment[];

    @ApiProperty()
    @IsOptional()
    note?: string;

    createdById: number;

}
