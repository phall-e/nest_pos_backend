import { BranchResponseDto } from "@/modules/admin/master-data/branch/dto/branch-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { StockAdjustmentAttachment } from "./attachement.dto";
import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { StockAdjustmentItemResponseDto } from "./stock-adjustment-item-response.dto";

export class StockAdjustmentResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    code: string;

    @ApiProperty()
    adjustmentDate: Date;

    @ApiProperty()
    branchId: number;

    @ApiProperty()
    branch: BranchResponseDto;

    @ApiProperty()
    description: string;

    @ApiProperty()
    attachments: StockAdjustmentAttachment[];

    @ApiProperty()
    totalQuantity: number;

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
    items: StockAdjustmentItemResponseDto[];
}