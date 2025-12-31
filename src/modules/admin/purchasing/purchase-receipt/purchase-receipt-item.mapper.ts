import { ProductMapper } from "../../master-data/product/product.mapper";
import { CreatePurchaseReceiptItemRequestDto } from "./dto/create-purchase-receipt-item-request.dto";
import { PurchaseReceiptItemResponseDto } from "./dto/purchase-receipt-item-response.dto";
import { UpdatePurchaseReceiptItemRequestDto } from "./dto/update-purchase-receipt-item-request.dto";
import { PurchaseReceiptItemEntity } from "./entities/purchase-receipt-item.entity";
import { PurchaseReceiptMapper } from "./purchase-receipt.mapper";

export class PurchaseReceiptItemMapper {
    public static async toDto(entity: PurchaseReceiptItemEntity): Promise<PurchaseReceiptItemResponseDto> {
        const dto = new PurchaseReceiptItemResponseDto();
        dto.id = entity.id;
        dto.purchaseReceiptId = entity.purchaseReceiptId;
        dto.productId = entity.productId;
        dto.quantity = entity.quantity ? parseFloat(entity.quantity as any) : null;
        dto.unitPrice = entity.unitPrice ? parseFloat(entity.unitPrice as any) : null;
        dto.discount = entity.discount ? parseFloat(entity.discount as any) : null;
        dto.note = entity.note;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.purchaseReceipt) {
            dto.purchaseReceipt = await PurchaseReceiptMapper.toDto(entity.purchaseReceipt);
        }

        if (entity.product) {
            dto.product = await ProductMapper.toDto(entity.product);
        }

        return dto;
    }

    public static toCreateEntity(dto: CreatePurchaseReceiptItemRequestDto): PurchaseReceiptItemEntity {
        const entity = new PurchaseReceiptItemEntity();

        entity.productId = dto.productId;
        entity.quantity = dto.quantity;
        entity.unitPrice = dto.unitPrice;
        entity.discount = dto.discount;
        entity.note = dto.note;

        return entity;
    }

    public static toUpdateEntity(entity: PurchaseReceiptItemEntity, dto: UpdatePurchaseReceiptItemRequestDto): PurchaseReceiptItemEntity {
        entity.productId = dto.productId;
        entity.quantity = dto.quantity;
        entity.unitPrice = dto.unitPrice;
        entity.discount = dto.discount;
        entity.note = dto.note;

        return entity;
    }
}