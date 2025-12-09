import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginRequestDto {
    @ApiProperty({
        example: 'Admin',
    })
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: '123'
    })
    @IsNotEmpty()
    password: string;
}