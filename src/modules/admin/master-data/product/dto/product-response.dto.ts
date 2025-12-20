import { ApiProperty } from "@nestjs/swagger";
import { CategoryResponseDto } from "../../category/dto/category-response.dto";
import { UomResponseDto } from "../../uom/dto/uom-response.dto";
import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";

export class ProductResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    code: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    nameKh: string;

    @ApiProperty()
    unitPrice: number;

    @ApiProperty()
    description: string;

    @ApiProperty()
    attachment: string;

    @ApiProperty()
    categoryId: number;

    @ApiProperty()
    category: CategoryResponseDto;

    @ApiProperty()
    uomId: number;

    @ApiProperty()
    uom: UomResponseDto;

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