import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { SalePaymentReceiptAttachment } from "./attachement.dto";
import { SaleResponseDto } from "../../sale/dto/sale-response.dto";

export class SalePaymentReceiptResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    code: string;

    @ApiProperty()
    saleId: number;

    @ApiProperty()
    sale: SaleResponseDto;

    @ApiProperty()
    createdById: number;

    @ApiProperty()
    createdBy: UserResponseDto;

    @ApiProperty()
    receiptById: number;

    @ApiProperty()
    receiptBy: UserResponseDto;

    @ApiProperty()
    receiptDate: Date;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    attachments: SalePaymentReceiptAttachment[];

    @ApiProperty()
    note: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}