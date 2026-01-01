import { BranchMapper } from "../../master-data/branch/branch.mapper";
import { ProductMapper } from "../../master-data/product/product.mapper";
import { UserMapper } from "../../system/user/user.mapper";
import { CreateStockRequestDto } from "./dto/create-stock-request.dto";
import { StockResponseDto } from "./dto/stock-response.dto";
import { UpdateStockRequestDto } from "./dto/update-stock-request.dto";
import { StockEntity } from "./entities/stock.entity";

export class StockMapper {
    public static async toDto(entity: StockEntity): Promise<StockResponseDto> {
        const dto = new StockResponseDto();

        dto.id = entity.id;
        dto.branchId = entity.branchId;
        dto.productId = entity.productId;
        dto.minStock = entity.minStock ? parseFloat(entity.minStock as any) : null;
        dto.stockIn = entity.stockIn ? parseFloat(entity.stockIn as any) : null;
        dto.stockAdjustment = entity.stockAdjustment ? parseFloat(entity.stockAdjustment as any) : null;
        dto.stockTransfer = entity.stockTransfer ? parseFloat(entity.stockTransfer as any) : null;
        dto.stockOut = entity.stockOut ? parseFloat(entity.stockOut as any) : null;
        dto.createdById = entity.createdById;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.branch) {
            dto.branch = await BranchMapper.toDto(entity.branch);
        }

        if (entity.product) {
            dto.product = await ProductMapper.toDto(entity.product);
        }

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        return dto;
    }

    public static toCreateEntity(dto: CreateStockRequestDto): StockEntity {
        const entity = new StockEntity();
        entity.branchId = dto.branchId;
        entity.productId = dto.productId;
        entity.minStock = dto.minStock;
        entity.stockIn = dto.stockIn;
        entity.stockAdjustment = dto.stockAdjustment;
        entity.stockTransfer = dto.stockTransfer;
        entity.stockOut = dto.stockOut;
        entity.createdById = dto.createdById;

        return entity;
    }

    public static toUpdateEntity(entity: StockEntity, dto: UpdateStockRequestDto): StockEntity {
        entity.branchId = dto.branchId;
        entity.productId = dto.productId;
        entity.minStock = dto.minStock;
        entity.stockIn = dto.stockIn;
        entity.stockAdjustment = dto.stockAdjustment;
        entity.stockTransfer = dto.stockTransfer;
        entity.stockOut = dto.stockOut;
        
        return entity;
    }
}