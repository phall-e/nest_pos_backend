import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUomRequestDto {
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

    createdById: number;
}
