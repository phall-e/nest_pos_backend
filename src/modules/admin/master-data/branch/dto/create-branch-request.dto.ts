import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBranchRequestDto {
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
    @IsString()
    managerName: string;

    @ApiProperty()
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty()
    @IsOptional()
    address?: string;

    createdbyId: number;
}
