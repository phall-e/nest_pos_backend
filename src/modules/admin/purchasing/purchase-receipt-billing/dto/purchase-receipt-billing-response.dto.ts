import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { PurchaseReceiptBillingAttachment } from "./attachement.dto";
import { PurchaseReceiptResponseDto } from "../../purchase-receipt/dto/purchase-receipt-response.dto";

export class PurchaseReceiptBillingResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    code: string;

    @ApiProperty()
    purchaseReceiptId: number;

    @ApiProperty()
    purchaseReceipt: PurchaseReceiptResponseDto;

    @ApiProperty()
    createdById: number;

    @ApiProperty()
    createdBy: UserResponseDto;

    @ApiProperty()
    billingById: number;

    @ApiProperty()
    billingBy: UserResponseDto;

    @ApiProperty()
    billingDate: Date;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    attachments: PurchaseReceiptBillingAttachment[];

    @ApiProperty()
    note: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}