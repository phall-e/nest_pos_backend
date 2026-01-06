import { ProductMapper } from "../../master-data/product/product.mapper";
import { CreateStockTransferItemRequestDto } from "./dto/create-stock-transfer-item-request.dto";
import { StockTransferItemResponseDto } from "./dto/stock-transfer-item-response.dto";
import { UpdateStockTransferItemRequestDto } from "./dto/update-stock-transfer-item-request.dto";
import { StockTransferItemEntity } from "./entities/stock-transfer-item.entity";
import { StockTransferMapper } from "./stock-transfer.mapper";

export class StockTransferItemMapper {
    public static async toDto(entity: StockTransferItemEntity): Promise<StockTransferItemResponseDto> {
        const dto = new StockTransferItemResponseDto();

        dto.id = entity.id;
        dto.stockTransferId = entity.stockTransferId;
        dto.productId = entity.productId;
        dto.quantity = entity.quantity ? parseFloat(entity.quantity as any) : null;
        dto.note = entity.note;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.stockTransfer) {
            dto.stockTransfer = await StockTransferMapper.toDto(entity.stockTransfer);
        }

        if (entity.product) {
            dto.product = await ProductMapper.toDto(entity.product);
        }

        return dto;
    }

    public static toCreateEntity(dto: CreateStockTransferItemRequestDto): StockTransferItemEntity {
        const entity = new StockTransferItemEntity();

        entity.productId = dto.productId;
        entity.quantity = dto.quantity;
        entity.note = dto.note;

        return entity;
    }

    public static toUpdateEntity(entity: StockTransferItemEntity, dto: UpdateStockTransferItemRequestDto): StockTransferItemEntity {
        entity.productId = dto.productId;
        entity.quantity = dto.quantity;
        entity.note = dto.note;

        return entity;
    }
}