import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CreateStockInItemRequestDto } from "./create-stock-in-item-request.dto";

export class CreateStockInRequestDto {
    @ApiProperty()
    @ValidateNested({ each: true })
    @Type(() => CreateStockInItemRequestDto )
    items: CreateStockInItemRequestDto[];

    createdById: number;
}
