import { PartialType } from "@nestjs/swagger";
import { CreateStockAdjustmentItemRequestDto } from "./create-stock-adjustment-item-request.dto";

export class UpdateStockAdjustmentItemRequestDto extends PartialType(CreateStockAdjustmentItemRequestDto){
}