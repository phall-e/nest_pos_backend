import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserRequestDto {
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ type: [Number], required: false })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @Type(() => Number)
    roles: number[];
    
    @ApiProperty({ required: false, default: null })
    @IsOptional()
    @IsBoolean()
    isAdmin?: boolean;

    @ApiProperty({ required: false, default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

}
