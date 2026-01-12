import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { CreateStockRequestDto } from "./create-stock-request.dto";

export class CreateStockBatchRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStockRequestDto)
  items: CreateStockRequestDto[]
}
