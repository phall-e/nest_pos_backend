import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CustomerAttachment } from "./attachement.dto";

export class CreateCustomerRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    customerTypeId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nameEn: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nameKh: string;

    @ApiProperty()
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty()
    @IsOptional()
    address?: string;

    @ApiProperty()
    @IsOptional()
    note?: string;

    @ApiProperty()
    @IsOptional()
    profile?: string;

    @ApiProperty()
    @IsOptional()
    attachments?: CustomerAttachment[];

    createdById: number;
}
