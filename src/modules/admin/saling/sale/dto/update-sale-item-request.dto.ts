import { PartialType } from "@nestjs/swagger";
import { CreateSaleItemRequestDto } from "./create-sale-item-request.dto";

export class UpdateSaleItemRequestDto extends PartialType(CreateSaleItemRequestDto) {

}