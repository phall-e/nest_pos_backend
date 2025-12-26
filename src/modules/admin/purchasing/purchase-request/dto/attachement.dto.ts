import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

class FileDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNumber()
    @IsOptional()
    size: number;
}

export class PurchaseRequestAttachment {
    @IsObject()
    file: FileDto;

    @IsString()
    @IsOptional()
    url: string;

    @IsBoolean()
    @IsOptional()
    isImage: boolean;

    @IsNotEmpty()
    @IsString()
    code: string;
}