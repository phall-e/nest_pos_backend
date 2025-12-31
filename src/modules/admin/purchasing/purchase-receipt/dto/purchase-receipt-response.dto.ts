import { ApiProperty } from "@nestjs/swagger";
import { PurchaseOrderResponseDto } from "../../purchase-order/dto/purchase-order-response.dto";
import { BranchResponseDto } from "@/modules/admin/master-data/branch/dto/branch-response.dto";
import { SupplierResponseDto } from "@/modules/admin/master-data/supplier/dto/supplier-response.dto";
import { PurchaseReceiptAttachment } from "./attachement.dto";
import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { PurchaseReceiptItemResponseDto } from "./purchase-receipt-item-response.dto";

export class PurchaseReceiptResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    code: string;

    @ApiProperty()
    receiptDate: Date;

    @ApiProperty()
    purchaseOrderId: number;

    @ApiProperty()
    purchaseOrder: PurchaseOrderResponseDto;

    @ApiProperty()
    branchId: number;

    @ApiProperty()
    branch: BranchResponseDto;

    @ApiProperty()
    supplierId: number;

    @ApiProperty()
    supplier: SupplierResponseDto;

    @ApiProperty()
    receiptRef: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    reason: string;

    @ApiProperty()
    attachments: PurchaseReceiptAttachment[];

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
    totalNetAmount: number;

    @ApiProperty()
    totalDiscount: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;

    @ApiProperty()
    items: PurchaseReceiptItemResponseDto[];
}