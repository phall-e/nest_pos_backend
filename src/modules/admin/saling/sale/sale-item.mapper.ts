import { ProductMapper } from "../../master-data/product/product.mapper";
import { CreateSaleItemRequestDto } from "./dto/create-sale-item-request.dto";
import { SaleItemResponseDto } from "./dto/sale-item-response.dto";
import { UpdateSaleItemRequestDto } from "./dto/update-sale-item-request.dto";
import { SaleItemEntity } from "./entities/sale-item.entity";
import { SaleMapper } from "./sale.mapper";

export class SaleItemMapper {
    public static async toDto(entity: SaleItemEntity): Promise<SaleItemResponseDto> {
        
        const dto = new SaleItemResponseDto();

        dto.id = entity.id;
        dto.saleId = entity.saleId;
        dto.productId = entity.productId;
        dto.quantity = entity.quantity ? parseFloat(entity.quantity as any) : null;
        dto.discount = entity.discount ? parseFloat(entity.discount as any) : null;
        dto.unitPrice = entity.unitPrice ? parseFloat(entity.unitPrice as any) : null;
        dto.note = entity.note;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.sale) {
            dto.sale = await SaleMapper.toDto(entity.sale);
        }

        if (entity.product) {
            dto.product = await ProductMapper.toDto(entity.product);
        }

        return dto;

    }

    public static toCreateEntity(dto: CreateSaleItemRequestDto): SaleItemEntity {
        
        const entity = new SaleItemEntity();

        entity.productId = dto.productId;
        entity.quantity = dto.quantity;
        entity.discount = dto.discount;
        entity.unitPrice = dto.unitPrice;
        entity.note = dto.note;

        return entity;

    }

    public static toUpdateEntity(entity: SaleItemEntity, dto: UpdateSaleItemRequestDto): SaleItemEntity {

        entity.productId = dto.productId;
        entity.quantity = dto.quantity;
        entity.discount = dto.discount;
        entity.unitPrice = dto.unitPrice;
        entity.note = dto.note;

        return entity;

    }
}