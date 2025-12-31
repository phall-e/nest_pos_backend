import { BranchMapper } from "../../master-data/branch/branch.mapper";
import { SupplierMapper } from "../../master-data/supplier/supplier.mapper";
import { UserMapper } from "../../system/user/user.mapper";
import { PurchaseRequestMapper } from "../purchase-request/purchase-request.mapper";
import { CreatePurchaseOrderRequestDto } from "./dto/create-purchase-order-request.dto";
import { PurchaseOrderResponseDto } from "./dto/purchase-order-response.dto";
import { UpdatePurchaseOrderRequestDto } from "./dto/update-purchase-order-request.dto";
import { PurchaseOrderItemEntity } from "./entities/purchase-order-item.entity";
import { PurchaseOrderEntity } from "./entities/purchase-order.entity";
import { PurchaseOrderItemMapper } from "./purchase-order-item.mapper";

export class PurchaseOrderMapper {
    public static async toDto(entity: PurchaseOrderEntity): Promise<PurchaseOrderResponseDto> {
        const dto = new PurchaseOrderResponseDto();

        dto.id = entity.id;
        dto.code = entity.code;
        dto.orderDate = entity.orderDate;
        dto.purchaseRequestId = entity.purchaseRequestId;
        dto.branchId = entity.branchId;
        dto.supplierId = entity.supplierId;
        dto.description = entity.description;
        dto.reason = entity.reason;
        dto.attachments = entity.attachments ? [...entity.attachments] : [];
        dto.createdById = entity.createdById;
        dto.approvedById = entity.approvedById;
        dto.status = entity.status;
        dto.totalQuantity = entity.totalQuantity ? parseFloat(entity.totalQuantity as any) : null;
        dto.totalAmount = entity.totalAmount ? parseFloat(entity.totalAmount as any) : null;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.purchaseRequest) {
            dto.purchaseRequest = await PurchaseRequestMapper.toDto(entity.purchaseRequest);
        }

        if (entity.branch) {
            dto.branch = await BranchMapper.toDto(entity.branch);
        }

        if (entity.supplier) {
            dto.supplier = await SupplierMapper.toDto(entity.supplier);
        }

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        if (entity.approvedBy) {
            dto.approvedBy = await UserMapper.toDto(entity.approvedBy);
        }

        if (entity.items && entity.items.length > 0) {
            dto.items = await Promise.all(
                entity.items.map((item) => PurchaseOrderItemMapper.toDto(item)),
            );
        }

        return dto;
    }

    public static toCreateEntity(dto: CreatePurchaseOrderRequestDto): PurchaseOrderEntity {
        const entity = new PurchaseOrderEntity();

        entity.code = dto.code;
        entity.orderDate = dto.orderDate;
        entity.purchaseRequestId = dto.purchaseRequestId;
        entity.branchId = dto.branchId;
        entity.supplierId = dto.supplierId;
        entity.description = dto.description;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.status = dto.status;
        entity.totalQuantity = dto.totalQuantity;
        entity.totalAmount = dto.totalAmount;
        entity.createdById = dto.createdById;

        if (dto.items && dto.items.length > 0) {
            entity.items = dto.items.map((itemDto) => {
                const itemEntity = PurchaseOrderItemMapper.toCreateEntity(itemDto);
                return itemEntity;
            });
        }

        return entity;
    }

    public static toUpdateEntity(entity: PurchaseOrderEntity, dto: UpdatePurchaseOrderRequestDto): PurchaseOrderEntity {
        entity.code = dto.code;
        entity.orderDate = dto.orderDate;
        entity.purchaseRequestId = dto.purchaseRequestId;
        entity.branchId = dto.branchId;
        entity.supplierId = dto.supplierId;
        entity.description = dto.description;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.status = dto.status;
        entity.totalQuantity = dto.totalQuantity;
        entity.totalAmount = dto.totalAmount;

        if (dto.items && dto.items.length > 0) {
            entity.items = dto.items.map((itemDto) => {
                let itemEntity: PurchaseOrderItemEntity | null = null;

                if (itemDto.id) {
                    itemEntity = PurchaseOrderItemMapper.toUpdateEntity(
                        new PurchaseOrderItemEntity({ id: itemDto.id }),
                        { ...itemDto },
                    );
                } else {
                    itemEntity = PurchaseOrderItemMapper.toCreateEntity(itemDto);
                }

                itemEntity.purchaseOrder = entity;
                return itemEntity;
            })
        }

        return entity;
    }
}