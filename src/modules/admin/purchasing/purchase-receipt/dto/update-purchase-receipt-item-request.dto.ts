import { PartialType } from "@nestjs/swagger";
import { CreatePurchaseReceiptItemRequestDto } from "./create-purchase-receipt-item-request.dto";

export class UpdatePurchaseReceiptItemRequestDto extends PartialType(CreatePurchaseReceiptItemRequestDto){

}