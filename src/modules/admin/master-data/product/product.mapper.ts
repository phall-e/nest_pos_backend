import { UserMapper } from "../../system/user/user.mapper";
import { CategoryMapper } from "../category/category.mapper";
import { UomMapper } from "../uom/uom.mapper";
import { CreateProductRequestDto } from "./dto/create-product-request.dto";
import { ProductResponseDto } from "./dto/product-response.dto";
import { UpdateProductRequestDto } from "./dto/update-product-request.dto";
import { ProductEntity } from "./entities/product.entity";

export class ProductMapper {
    public static async toDto(entity: ProductEntity): Promise<ProductResponseDto> {
        const dto = new ProductResponseDto();
        dto.id = entity.id;
        dto.code = entity.code;
        dto.nameEn = entity.nameEn;
        dto.nameKh = entity.nameKh;
        dto.unitPrice = entity.unitPrice ? parseFloat(entity.unitPrice as any) : null;
        dto.description = entity.description;
        dto.attachment = entity.attachment;
        dto.categoryId = entity.categoryId;
        dto.uomId = entity.uomId;
        dto.createdById = entity.createdById;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.category) {
            dto.category = await CategoryMapper.toDto(entity.category);
        }

        if (entity.uom) {
            dto.uom = await UomMapper.toDto(entity.uom);
        }

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        return dto;
    }

    public static toCreateEntity(dto: CreateProductRequestDto): ProductEntity {
        const entity = new ProductEntity();
        entity.code = dto.code;
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.unitPrice = dto.unitPrice;
        entity.description = dto.description;
        entity.attachment = dto.attachment;
        entity.categoryId = dto.categoryId;
        entity.uomId = dto.uomId;
        entity.createdById = dto.createdById;

        return entity;
    }

    public static toUpdateEntity(entity: ProductEntity, dto: UpdateProductRequestDto): ProductEntity {
        entity.code = dto.code;
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.unitPrice = dto.unitPrice;
        entity.description = dto.description;
        entity.attachment = dto.attachment;
        entity.categoryId = dto.categoryId;
        entity.uomId = dto.uomId;
        entity.createdById = dto.createdById;
        entity.updatedAt = new Date();

        return entity;
    }
}