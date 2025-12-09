import { ApiProperty } from "@nestjs/swagger";
import { PermissionResponseDto } from "../../permission/dto/permission-response.dto";

export class RoleResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    permissions: PermissionResponseDto[];
}