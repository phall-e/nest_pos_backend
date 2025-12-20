import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nameEn: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nameKh: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    unitPrice: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    categoryId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    uomId: number;

    @ApiProperty()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsOptional()
    attachment?: string;

    createdById: number;
}
