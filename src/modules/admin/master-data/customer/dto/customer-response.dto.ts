import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { CustomerTypeResponseDto } from "../../customer-type/dto/customer-type-response.dto";
import { CustomerAttachment } from "./attachement.dto";

export class CustomerResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    customerTypeId: number;

    @ApiProperty()
    customerType: CustomerTypeResponseDto;

    @ApiProperty()
    code: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    nameKh: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    note: string;

    @ApiProperty()
    profile: string;

    @ApiProperty()
    attachments: CustomerAttachment[];

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