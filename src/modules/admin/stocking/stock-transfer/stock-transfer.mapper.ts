import { BranchMapper } from "../../master-data/branch/branch.mapper";
import { UserMapper } from "../../system/user/user.mapper";
import { CreateStockTransferRequestDto } from "./dto/create-stock-transfer-request.dto";
import { StockTransferResponseDto } from "./dto/stock-transfer-response.dto";
import { UpdateStockTransferRequestDto } from "./dto/update-stock-transfer-request.dto";
import { StockTransferItemEntity } from "./entities/stock-transfer-item.entity";
import { StockTransferEntity } from "./entities/stock-transfer.entity";
import { StockTransferItemMapper } from "./stock-transfer-item.mapper";

export class StockTransferMapper {
    public static async toDto(entity: StockTransferEntity): Promise<StockTransferResponseDto> {
        const dto = new StockTransferResponseDto();

        dto.id = entity.id;
        dto.code = entity.code;
        dto.transferDate = entity.transferDate;
        dto.fromBranchId = entity.fromBranchId;
        dto.toBranchId = entity.toBranchId;
        dto.totalQuantity = entity.totalQuantity ? parseFloat(entity.totalQuantity as any) : null;
        dto.attachments = entity.attachments ? [...entity.attachments] : [];
        dto.description = entity.description;
        dto.createdById = entity.createdById;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.fromBranch) {
            dto.fromBranch = await BranchMapper.toDto(entity.fromBranch);
        }

        if (entity.toBranch) {
            dto.toBranch = await BranchMapper.toDto(entity.toBranch);
        }

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        if (entity.items && entity.items.length > 0) {
            dto.items = await Promise.all(
                entity.items.map((item) => StockTransferItemMapper.toDto(item))
            );
        }

        return dto;
    }

    public static toCreateEntity(dto: CreateStockTransferRequestDto): StockTransferEntity {
        const entity = new StockTransferEntity();

        entity.code = dto.code;
        entity.transferDate = dto.transferDate;
        entity.fromBranchId = dto.fromBranchId;
        entity.toBranchId = dto.toBranchId;
        entity.totalQuantity = dto.totalQuantity;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.description = dto.description;
        entity.createdById = dto.createdById;

        if (dto.items && dto.items.length > 0) {
            entity.items = dto.items.map((itemDto) => {
                const itemEntity = StockTransferItemMapper.toCreateEntity(itemDto);
                return itemEntity;
            });
        }

        return entity;
    }

    public static toUpdateEntity(entity: StockTransferEntity, dto: UpdateStockTransferRequestDto): StockTransferEntity {
        entity.transferDate = dto.transferDate;
        entity.fromBranchId = dto.fromBranchId;
        entity.toBranchId = dto.toBranchId;
        entity.totalQuantity = dto.totalQuantity;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.description = dto.description;
        entity.createdById = dto.createdById;

        if (dto.items && dto.items.length > 0) {
            entity.items = dto.items.map((itemDto) => {
                let itemEntity: StockTransferItemEntity | null = null;
                if (itemDto.id) {
                    itemEntity = StockTransferItemMapper.toUpdateEntity(
                        new StockTransferItemEntity({ id: itemDto.id }),
                        { ...itemDto },
                    );
                } else {
                    itemEntity = StockTransferItemMapper.toCreateEntity(itemDto);
                }

                itemEntity.stockTransfer = entity;
                return itemEntity;
            });
        }
        
        return entity;
    }
}