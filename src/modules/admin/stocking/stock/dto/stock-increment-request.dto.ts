import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsNumber } from "class-validator";

export class StockIncrementRequestDto {
    @ApiProperty({ type: [Number] })
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    branchIds: number[];

    @ApiProperty({ type: [Number] })
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    productIds: number[];

    @ApiProperty({ type: [Number] })
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    quantities: number[];
}