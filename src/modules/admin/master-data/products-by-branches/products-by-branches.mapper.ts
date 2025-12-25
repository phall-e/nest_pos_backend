import { UserMapper } from "../../system/user/user.mapper";
import { BranchMapper } from "../branch/branch.mapper";
import { ProductMapper } from "../product/product.mapper";
import { CreateProductsByBranchRequestDto } from "./dto/create-products-by-branch-request.dto";
import { ProductsByBranchesResponseDto } from "./dto/products-by-branches-response.dto";
import { UpdateProductsByBranchRequestDto } from "./dto/update-products-by-branch-request.dto";
import { ProductsByBranchesEntity } from "./entities/products-by-branch.entity";

export class ProductsByBranchesMapper {
    public static async toDto(entity: ProductsByBranchesEntity): Promise<ProductsByBranchesResponseDto> {
        const dto = new ProductsByBranchesResponseDto();
        dto.id = entity.id;
        dto.productId = entity.productId;
        dto.branchId = entity.branchId;
        dto.salePrice = entity.salePrice ? parseFloat(entity.salePrice as any) : null;
        dto.note = entity.note;
        dto.createdById = entity.createdById;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.product) {
            dto.product = await ProductMapper.toDto(entity.product);
        }

        if (entity.branch) {
            dto.branch = await BranchMapper.toDto(entity.branch);
        }

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        return dto;
    }

    public static toCreateEntity(dto: CreateProductsByBranchRequestDto): ProductsByBranchesEntity {
        const entity = new ProductsByBranchesEntity();
        entity.productId = dto.productId;
        entity.branchId = dto.branchId;
        entity.salePrice = dto.salePrice;
        entity.note = dto.note;
        entity.createdById = dto.createdById;

        return entity;
    }

    public static toUpdateEntity(entity: ProductsByBranchesEntity, dto: UpdateProductsByBranchRequestDto): ProductsByBranchesEntity {
        entity.productId = dto.productId;
        entity.branchId = dto.branchId;
        entity.salePrice = dto.salePrice;
        entity.note = dto.note;

        return entity;
    }
}