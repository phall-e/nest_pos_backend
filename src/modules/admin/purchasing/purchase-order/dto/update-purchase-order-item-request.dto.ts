import { PartialType } from "@nestjs/swagger";
import { CreatePurchaseOrderItemRequestDto } from "./create-purchase-order-item-request.dto";

export class UpdatePurchaseOrderItemRequestDto extends PartialType(CreatePurchaseOrderItemRequestDto) {
}