import { ProductMapper } from "../../master-data/product/product.mapper";
import { CreateStockAdjustmentItemRequestDto } from "./dto/create-stock-adjustment-item-request.dto";
import { StockAdjustmentItemResponseDto } from "./dto/stock-adjustment-item-response.dto";
import { UpdateStockAdjustmentItemRequestDto } from "./dto/update-stock-adjustment-item-request.dto";
import { StockAdjustmentItemEntity } from "./entities/stock-adjustment-item.entity";
import { StockAdjustmentMapper } from "./stock-adjustment.mapper";

export class StockAdjustmentItemMapper {
    public static async toDto(entity: StockAdjustmentItemEntity): Promise<StockAdjustmentItemResponseDto> {
        const dto = new StockAdjustmentItemResponseDto();

        dto.id = entity.id;
        dto.stockAdjustmentId = entity.stockAdjustmentId;
        dto.productId = entity.productId;
        dto.quantity = entity.quantity ? parseFloat(entity.quantity as any) : null;
        dto.note = entity.note;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.stockAdjustment) {
            dto.stockAdjustment = await StockAdjustmentMapper.toDto(entity.stockAdjustment);
        }

        if (entity.product) {
            dto.product = await ProductMapper.toDto(entity.product);
        }

        return dto;
    }

    public static toCreateEntity(dto: CreateStockAdjustmentItemRequestDto): StockAdjustmentItemEntity {
        const entity = new StockAdjustmentItemEntity();
        
        entity.productId = dto.productId;
        entity.quantity = dto.quantity;
        entity.note = dto.note;

        return entity;
    }

    public static toUpdateEntity(entity: StockAdjustmentItemEntity, dto: UpdateStockAdjustmentItemRequestDto): StockAdjustmentItemEntity {
        entity.productId = dto.productId;
        entity.quantity = dto.quantity;
        entity.note = dto.note;

        return entity;
    }
}