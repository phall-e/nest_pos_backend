import { ProductMapper } from "../../master-data/product/product.mapper";
import { CreatePurchaseOrderItemRequestDto } from "./dto/create-purchase-order-item-request.dto";
import { PurchaseOrderItemResponseDto } from "./dto/purchase-order-item-response.dto";
import { UpdatePurchaseOrderItemRequestDto } from "./dto/update-purchase-order-item-request.dto";
import { PurchaseOrderItemEntity } from "./entities/purchase-order-item.entity";
import { PurchaseOrderMapper } from "./purchase-order.mapper";

export class PurchaseOrderItemMapper {
    public static async toDto(entity: PurchaseOrderItemEntity): Promise<PurchaseOrderItemResponseDto> {
        const dto = new PurchaseOrderItemResponseDto();

        dto.id = entity.id;
        dto.purchaseOrderId = entity.purchaseOrderId;
        dto.productId = entity.productId;
        dto.quantity = entity.quantity ? parseFloat(entity.quantity as any) : null;
        dto.unitPrice = entity.unitPrice ? parseFloat(entity.unitPrice as any) : null;
        dto.note = entity.note;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.purchaseOrder) {
            dto.purchaseOrder = await PurchaseOrderMapper.toDto(entity.purchaseOrder);
        }

        if (entity.product) {
            dto.product = await ProductMapper.toDto(entity.product);
        }

        return dto;
    }

    public static toCreateEntity(dto: CreatePurchaseOrderItemRequestDto): PurchaseOrderItemEntity {
        const entity = new PurchaseOrderItemEntity();

        entity.productId = dto.productId;
        entity.quantity = dto.quantity;
        entity.unitPrice = dto.unitPrice;
        entity.note = dto.note;

        return entity;
    }

    public static toUpdateEntity(entity: PurchaseOrderItemEntity, dto: UpdatePurchaseOrderItemRequestDto): PurchaseOrderItemEntity {
        entity.productId = dto.productId;
        entity.quantity = dto.quantity;
        entity.unitPrice = dto.unitPrice;
        entity.note = dto.note;

        return entity;
    }
}