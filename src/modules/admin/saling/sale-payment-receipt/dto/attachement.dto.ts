import { IsObject } from "class-validator";

export class SalePaymentReceiptAttachment {
    @IsObject()
    fileName: string;
}