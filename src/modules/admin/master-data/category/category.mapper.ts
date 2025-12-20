import { UserMapper } from "../../system/user/user.mapper";
import { CategoryResponseDto } from "./dto/category-response.dto";
import { CreateCategoryRequestDto } from "./dto/create-category-request.dto";
import { UpdateCategoryRequestDto } from "./dto/update-category-request.dto";
import { CategoryEntity } from "./entities/category.entity";

export class CategoryMapper {
    public static async toDto(entity: CategoryEntity): Promise<CategoryResponseDto> {
        const dto = new CategoryResponseDto();
        dto.id = entity.id;
        dto.code = entity.code;
        dto.nameEn = entity.nameEn;
        dto.nameKh = entity.nameKh;
        dto.createdById = entity.createdById;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;
        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        return dto;
    }

    public static toCreateEntity(dto: CreateCategoryRequestDto): CategoryEntity {
        const entity = new CategoryEntity();
        entity.code = dto.code;
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.createdById = dto.createdById;

        return entity;
    }

    public static toUpdateEntity(entity: CategoryEntity, dto: UpdateCategoryRequestDto): CategoryEntity {
        entity.code = dto.code;
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.updatedAt = new Date();
        return entity;
    }
}