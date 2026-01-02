import { BranchMapper } from "../../master-data/branch/branch.mapper";
import { UserMapper } from "../../system/user/user.mapper";
import { CreateStockAdjustmentRequestDto } from "./dto/create-stock-adjustment-request.dto";
import { StockAdjustmentResponseDto } from "./dto/stock-adjustment-response.dto";
import { UpdateStockAdjustmentRequestDto } from "./dto/update-stock-adjustment-request.dto";
import { StockAdjustmentItemEntity } from "./entities/stock-adjustment-item.entity";
import { StockAdjustmentEntity } from "./entities/stock-adjustment.entity";
import { StockAdjustmentItemMapper } from "./stock-adjustment-item.mapper";

export class StockAdjustmentMapper {
    public static async toDto(entity: StockAdjustmentEntity): Promise<StockAdjustmentResponseDto> {
        const dto = new StockAdjustmentResponseDto();

        dto.id = entity.id;
        dto.code = entity.code;
        dto.adjustmentDate = entity.adjustmentDate;
        dto.branchId = entity.branchId;
        dto.description = entity.description;
        dto.attachments = entity.attachments ? [...entity.attachments] : [];
        dto.totalQuantity = entity.totalQuantity ? parseFloat(entity.totalQuantity as any) : null;
        dto.createdById = entity.createdById;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.branch) {
            dto.branch = await BranchMapper.toDto(entity.branch);
        }

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        if (entity.items && entity.items.length > 0) {
            dto.items = await Promise.all(
                entity.items.map((item) => StockAdjustmentItemMapper.toDto(item)),
            );
        }

        return dto;
    }

    public static toCreateEntity(dto: CreateStockAdjustmentRequestDto): StockAdjustmentEntity {
        const entity = new StockAdjustmentEntity();

        entity.code = dto.code;
        entity.adjustmentDate = dto.adjustmentDate;
        entity.branchId = dto.branchId;
        entity.description = dto.description;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.totalQuantity = dto.totalQuantity;
        entity.createdById = dto.createdById;

        if (dto.items && dto.items.length > 0) {
            entity.items = dto.items.map((itemDto) => {
                const itemEntity = StockAdjustmentItemMapper.toCreateEntity(itemDto);
                return itemEntity;
            });
        }

        return entity;
    }

    public static toUpdateEntity(entity: StockAdjustmentEntity, dto: UpdateStockAdjustmentRequestDto): StockAdjustmentEntity {
        entity.adjustmentDate = dto.adjustmentDate;
        entity.branchId = dto.branchId;
        entity.description = dto.description;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.totalQuantity = dto.totalQuantity;

        if (dto.items && dto.items.length > 0) {
            entity.items = dto.items.map((itemDto) => {
                let itemEntity: StockAdjustmentItemEntity | null = null;

                if (itemDto.id) {
                    itemEntity = StockAdjustmentItemMapper.toUpdateEntity(
                        new StockAdjustmentItemEntity({ id: itemDto.id }),
                        { ...itemDto },
                    );
                } else {
                    itemEntity = StockAdjustmentItemMapper.toCreateEntity(itemDto);
                }

                itemEntity.stockAdjustment = entity;
                return itemEntity;
            })
        }
        return entity;
    }
}