import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { TokenResponseDto } from "./token-response.dto";

export class LoginResponseDto {
    @ApiProperty({ type: () => TokenResponseDto })
    token: TokenResponseDto;

    @ApiProperty({ type: () => UserResponseDto })
    users: UserResponseDto;

    @ApiProperty({ type: [String] })
    permissions: string[];
}   