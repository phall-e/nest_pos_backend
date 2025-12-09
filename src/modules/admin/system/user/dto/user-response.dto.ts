import { ApiProperty } from "@nestjs/swagger";
import { RoleResponseDto } from "../../role/dto/role-response.dto";

export class UserResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    username: string;

    @ApiProperty()
    roles: RoleResponseDto[];

    @ApiProperty()
    isAdmin: boolean;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
    
    @ApiProperty()
    permissions: string[];
    
}