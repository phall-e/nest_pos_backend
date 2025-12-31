import { ApiProperty } from "@nestjs/swagger";
import { PurchaseRequestResponseDto } from "../../purchase-request/dto/purchase-request-response.dto";
import { BranchResponseDto } from "@/modules/admin/master-data/branch/dto/branch-response.dto";
import { SupplierResponseDto } from "@/modules/admin/master-data/supplier/dto/supplier-response.dto";
import { PurchaseOrderAttachment } from "./attachement.dto";
import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { PurchaseOrderItemResponseDto } from "./purchase-order-item-response.dto";

export class PurchaseOrderResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    code: string;

    @ApiProperty()
    orderDate: Date;

    @ApiProperty()
    purchaseRequestId: number;

    @ApiProperty()
    purchaseRequest: PurchaseRequestResponseDto;

    @ApiProperty()
    branchId: number;

    @ApiProperty()
    branch: BranchResponseDto;

    @ApiProperty()
    supplierId: number;

    @ApiProperty()
    supplier: SupplierResponseDto;

    @ApiProperty()
    description: string;

    @ApiProperty()
    reason: string;

    @ApiProperty()
    attachments: PurchaseOrderAttachment[];

    @ApiProperty()
    createdById: number;

    @ApiProperty()
    createdBy: UserResponseDto;

    @ApiProperty()
    approvedById: number;

    @ApiProperty()
    approvedBy: UserResponseDto;

    @ApiProperty()
    status: string;

    @ApiProperty()
    totalQuantity: number;

    @ApiProperty()
    totalAmount: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;

    @ApiProperty()
    items: PurchaseOrderItemResponseDto[];
}