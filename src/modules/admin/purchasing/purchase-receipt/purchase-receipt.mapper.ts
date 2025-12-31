import { BranchMapper } from "../../master-data/branch/branch.mapper";
import { SupplierMapper } from "../../master-data/supplier/supplier.mapper";
import { UserMapper } from "../../system/user/user.mapper";
import { PurchaseOrderMapper } from "../purchase-order/purchase-order.mapper";
import { CreatePurchaseReceiptRequestDto } from "./dto/create-purchase-receipt-resquest.dto";
import { PurchaseReceiptResponseDto } from "./dto/purchase-receipt-response.dto";
import { UpdatePurchaseReceiptRequestDto } from "./dto/update-purchase-receipt-request.dto";
import { PurchaseReceiptItemEntity } from "./entities/purchase-receipt-item.entity";
import { PurchaseReceiptEntity } from "./entities/purchase-receipt.entity";
import { PurchaseReceiptItemMapper } from "./purchase-receipt-item.mapper";

export class PurchaseReceiptMapper {
    public static async toDto(entity: PurchaseReceiptEntity): Promise<PurchaseReceiptResponseDto>{
        const dto = new PurchaseReceiptResponseDto();
        dto.id = entity.id;
        dto.code = entity.code;
        dto.receiptDate = entity.receiptDate;
        dto.purchaseOrderId = entity.purchaseOrderId;
        dto.branchId = entity.branchId;
        dto.supplierId = entity.supplierId;
        dto.receiptRef = entity.receiptRef;
        dto.description = entity.description;
        dto.reason = entity.reason;
        dto.attachments = entity.attachments ? [...entity.attachments] : [];
        dto.createdById = entity.createdById;
        dto.approvedById = entity.approveedById;
        dto.status = entity.status;
        dto.totalQuantity = entity.totalQuantity ? parseFloat(entity.totalQuantity as any) : null;
        dto.totalAmount = entity.totalAmount ? parseFloat(entity.totalAmount as any) : null;
        dto.totalNetAmount = entity.totalNetAmount ? parseFloat(entity.totalNetAmount as any) : null;
        dto.totalDiscount = entity.totalDiscount ? parseFloat(entity.totalDiscount as any) : null;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.purchaseOrder) {
            dto.purchaseOrder = await PurchaseOrderMapper.toDto(entity.purchaseOrder);
        }

        if (entity.branch) {
            dto.branch = await BranchMapper.toDto(entity.branch);
        }

        if (entity.supplier) {
            dto.supplier = await SupplierMapper.toDto(entity.supplier);
        }

        if (entity.approvedBy) {
            dto.approvedBy = await UserMapper.toDto(entity.approvedBy);
        }

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        if (entity.items && entity.items.length > 0) {
            dto.items = await Promise.all(
                entity.items.map((item) => PurchaseReceiptItemMapper.toDto(item))
            );
        }

        return dto;
    }

    public static toCreateEntity(dto: CreatePurchaseReceiptRequestDto): PurchaseReceiptEntity {
        const entity = new PurchaseReceiptEntity();
        entity.code = dto.code;
        entity.receiptDate = dto.receiptDate;
        entity.purchaseOrderId = dto.purchaseOrderId;
        entity.branchId = dto.branchId;
        entity.supplierId = dto.supplierId;
        entity.receiptRef = dto.receiptRef;
        entity.description = dto.description;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.createdById = dto.createdById;
        entity.status = dto.status;
        entity.totalQuantity = dto.totalQuantity;
        entity.totalNetAmount = dto.totalNetAmount;
        entity.totalAmount = dto.totalAmount;
        entity.totalDiscount = dto.totalDiscount;
        
        if (dto.items && dto.items.length > 0) {
            entity.items = dto.items.map((itemDto) => {
                const itemEntity = PurchaseReceiptItemMapper.toCreateEntity(itemDto);
                return itemEntity;
            });
        }

        return entity;
    }

    public static toUpdateEntity(entity: PurchaseReceiptEntity, dto: UpdatePurchaseReceiptRequestDto): PurchaseReceiptEntity {
        entity.receiptDate = dto.receiptDate;
        entity.purchaseOrderId = dto.purchaseOrderId;
        entity.branchId = dto.branchId;
        entity.supplierId = dto.supplierId;
        entity.receiptRef = dto.receiptRef;
        entity.description = dto.description;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.status = dto.status;
        entity.totalQuantity = dto.totalQuantity;
        entity.totalNetAmount = dto.totalNetAmount;
        entity.totalAmount = dto.totalAmount;
        entity.totalDiscount = dto.totalDiscount;

        if (dto.items && dto.items.length > 0) {
            entity.items = dto.items.map((itemDto) => {
                let itemEntity: PurchaseReceiptItemEntity | null = null;

                if (itemDto.id) {
                    itemEntity = PurchaseReceiptItemMapper.toUpdateEntity(
                        new PurchaseReceiptItemEntity({ id: itemDto.id }),
                        { ...itemDto },
                    );
                } else {
                    itemEntity = PurchaseReceiptItemMapper.toCreateEntity(itemDto);
                }

                itemEntity.purchaseReceipt = entity;
                return itemEntity;
            });
        }

        return entity;
    }
}