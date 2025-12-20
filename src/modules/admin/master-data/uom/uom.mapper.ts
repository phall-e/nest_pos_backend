import { UserMapper } from "../../system/user/user.mapper";
import { CreateUomRequestDto } from "./dto/create-uom-request.dto";
import { UomResponseDto } from "./dto/uom-response.dto";
import { UpdateUomRequestDto } from "./dto/update-uom-request.dto";
import { UomEntity } from "./entities/uom.entity";

export class UomMapper {
    public static async toDto(entity: UomEntity): Promise<UomResponseDto> {
        const dto = new UomResponseDto();
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

    public static toCreateEntity(dto: CreateUomRequestDto): UomEntity {
        const entity = new UomEntity();
        entity.code = dto.code;
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.createdById = dto.createdById;

        return entity;
    }

    public static toUpdateEntity(entity: UomEntity, dto: UpdateUomRequestDto): UomEntity {
        entity.code = dto.code;
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.updatedAt = new Date();

        return entity;
    }
}