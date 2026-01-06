import { BranchResponseDto } from "@/modules/admin/master-data/branch/dto/branch-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { StockTransferAttachment } from "./attachement.dto";
import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { StockTransferItemResponseDto } from "./stock-transfer-item-response.dto";

export class StockTransferResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    code: string;

    @ApiProperty()
    transferDate: Date;

    @ApiProperty()
    fromBranchId: number;

    @ApiProperty()
    fromBranch: BranchResponseDto;

    @ApiProperty()
    toBranchId: number;

    @ApiProperty()
    toBranch: BranchResponseDto;

    @ApiProperty()
    totalQuantity: number;

    @ApiProperty()
    attachments: StockTransferAttachment[];

    @ApiProperty()
    description: string;

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
    items: StockTransferItemResponseDto[];
}