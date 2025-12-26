import { ProductMapper } from "../../master-data/product/product.mapper";
import { CreatePurchaseRequestItemRequestDto } from "./dto/create-purchase-request-item-request.dto";
import { PurchaseRequestItemResponseDto } from "./dto/purchase-request-item-response.dto";
import { UpdatePurchaseRequestItemRequestDto } from "./dto/update-purchase-request-item-request.dto";
import { PurchaseRequestItemEntity } from "./entities/purchase-request-item.entity";

export class PurchaseRequestItemMapper {
    public static async toDto(entity): Promise<PurchaseRequestItemResponseDto> {
        const dto = new PurchaseRequestItemResponseDto();
        dto.id = entity.id;
        dto.purchaseRequestId = entity.purchaseRequestId;
        dto.productId = entity.productId;
        dto.quantity = entity.quantity ? parseFloat(entity.quantity as any) : null;
        dto.note = entity.note;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.product) {
            dto.product = await ProductMapper.toDto(entity.product);
        }

        return entity;
    }

    public static toCreateEntity(dto: CreatePurchaseRequestItemRequestDto): PurchaseRequestItemEntity {
        const entity = new PurchaseRequestItemEntity();
        entity.productId = dto.productId;
        entity.quantity = dto.quantity;
        entity.note = dto.note;

        return entity;
    }

    public static toUpdateEntity(entity: PurchaseRequestItemEntity, dto: UpdatePurchaseRequestItemRequestDto): PurchaseRequestItemEntity {
        entity.productId = dto.productId;
        entity.quantity = dto.quantity;
        entity.note = dto.note;

        return entity;
    }
}