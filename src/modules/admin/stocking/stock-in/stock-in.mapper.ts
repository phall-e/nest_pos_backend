import { BranchMapper } from "../../master-data/branch/branch.mapper";
import { ProductMapper } from "../../master-data/product/product.mapper";
import { UserMapper } from "../../system/user/user.mapper";
import { CreateStockInRequestDto } from "./dto/create-stock-in-request.dto";
import { StockInResponseDto } from "./dto/stock-in-response.dto";
import { UpdateStockInRequestDto } from "./dto/update-stock-in-request.dto";
import { StockInEntity } from "./entities/stock-in.entity";

export class StockInMapper {
    public static async toDto(entity: StockInEntity): Promise<StockInResponseDto> {
        const dto = new StockInResponseDto();

        dto.id = entity.id;
        dto.branchId = entity.branchId;
        dto.productId = entity.productId;
        dto.quantity = entity.quantity ? parseFloat(entity.quantity as any) : null;
        dto.note = entity.note;
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

    public static toCreateEntity(dto: CreateStockInRequestDto): StockInEntity[] {

        return dto.items.map(item => {
            const entity = new StockInEntity();

            entity.purchaseReceiptId = item.purchaseReceiptId;
            entity.branchId = item.branchId;
            entity.productId = item.productId;
            entity.quantity = item.quantity;
            entity.note = item.note;
            entity.createdById = dto.createdById;

            return entity;
        })
    }

    public static toUpdateEntity(entity: StockInEntity, dto: UpdateStockInRequestDto): StockInEntity {
        entity.purchaseReceiptId = dto.purchaseReceiptId;
        entity.branchId = dto.branchId;
        entity.productId = dto.productId;
        entity.quantity = dto.quantity;
        entity.note = dto.note;

        return entity;
    }
}