import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class BranchResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    code: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    nameKh: string;

    @ApiProperty()
    managerName: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    createdById: number;

    @ApiProperty()
    createdBy: UserResponseDto;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}