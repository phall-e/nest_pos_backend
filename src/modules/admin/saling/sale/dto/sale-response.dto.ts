import { CustomerResponseDto } from "@/modules/admin/master-data/customer/dto/customer-response.dto";
import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { SaleAttachment } from "./attachement.dto";
import { SaleItemResponseDto } from "./sale-item-response.dto";
import { BranchResponseDto } from "@/modules/admin/master-data/branch/dto/branch-response.dto";

export class SaleResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    code: string;

    @ApiProperty()
    saleDate: Date;

    @ApiProperty()
    branchId: number;

    @ApiProperty()
    branch: BranchResponseDto;

    @ApiProperty()
    customerId: number;

    @ApiProperty()
    customer: CustomerResponseDto;

    @ApiProperty()
    soleById: number;

    @ApiProperty()
    soleBy: UserResponseDto;

    @ApiProperty()
    totalQuantity: number;

    @ApiProperty()
    totalDiscount: number;

    @ApiProperty()
    totalAmount: number;

    @ApiProperty()
    totalPaidAmount: number;

    @ApiProperty()
    attachments: SaleAttachment[];

    @ApiProperty()
    description: string;

    @ApiProperty()
    status: string;

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

    @ApiProperty()
    items: SaleItemResponseDto[];
}