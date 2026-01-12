import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, ValidateNested } from "class-validator";
import { CreateStockInItemRequestDto } from "./create-stock-in-item-request.dto";

export class CreateStockInRequestDto {
    @ApiProperty()
    @ValidateNested({ each: true })
    @Type(() => CreateStockInItemRequestDto )
    items: CreateStockInItemRequestDto[];

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    stockInDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    purchaseReceiptId: number;

    @ApiProperty()
    @IsNotEmpty()
    branchId: number;

    createdById: number;
}
