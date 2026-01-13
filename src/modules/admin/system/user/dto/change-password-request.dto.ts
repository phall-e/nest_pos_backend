import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordRequestDto {
    @IsNotEmpty()
    @IsString()
    oldPassword: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;
}