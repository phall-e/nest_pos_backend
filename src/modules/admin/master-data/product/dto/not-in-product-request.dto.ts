import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsOptional } from "class-validator";

export class NotInProductRequestDto {
    @ApiProperty()
    @IsOptional()
    @IsArray()
    @Transform(({ value }) =>
        Array.isArray(value)
        ? value.map(Number)
        : String(value).split(',').map(Number)
    )
    ids?: number[];

    @ApiProperty()
    @IsOptional()
    categoryId?: number;

    @ApiProperty()
    @IsOptional()
    uomId?: number;
}