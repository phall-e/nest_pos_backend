import { BranchResponseDto } from "@/modules/admin/master-data/branch/dto/branch-response.dto";
import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { PurchaseRequestItemResponseDto } from "./purchase-request-item-response.dto";
import { PurchaseRequestAttachment } from "./attachement.dto";

export class PurchaseRequestResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    code: string;

    @ApiProperty()
    requestDate: Date;

    @ApiProperty()
    branchId: number;

    @ApiProperty({ type: BranchResponseDto })
    branch: BranchResponseDto;

    @ApiProperty()
    description: string;

    @ApiProperty({ type: [PurchaseRequestAttachment] })
    attachments: PurchaseRequestAttachment[];

    @ApiProperty()
    createdById: number;

    @ApiProperty({ type: UserResponseDto })
    createdBy: UserResponseDto;

    @ApiProperty()
    status: string;

    @ApiProperty()
    approvedById: number;

    @ApiProperty()
    approvedBy: UserResponseDto;

    @ApiProperty()
    totalQuantity: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;

    @ApiProperty({ type: [PurchaseRequestItemResponseDto] })
    items: PurchaseRequestItemResponseDto[];

}