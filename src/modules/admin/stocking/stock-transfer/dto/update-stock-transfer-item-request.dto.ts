import { PartialType } from "@nestjs/swagger";
import { CreateStockTransferItemRequestDto } from "./create-stock-transfer-item-request.dto";
export class UpdateStockTransferItemRequestDto extends PartialType(CreateStockTransferItemRequestDto){
}