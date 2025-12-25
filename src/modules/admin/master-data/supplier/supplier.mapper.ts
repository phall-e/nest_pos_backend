import { UserMapper } from "../../system/user/user.mapper";
import { CreateSupplierRequestDto } from "./dto/create-supplier-request.dto";
import { SupplierResponseDto } from "./dto/supplier-response.dto";
import { UpdateSupplierRequestDto } from "./dto/update-supplier-request.dto";
import { SupplierEntity } from "./entities/supplier.entity";

export class SupplierMapper {
    public static async toDto(entity: SupplierEntity): Promise<SupplierResponseDto> {
        const dto = new SupplierResponseDto();
        dto.id = entity.id;
        dto.code = entity.code;
        dto.nameEn = entity.nameEn;
        dto.nameKh = entity.nameKh;
        dto.phoneNumber = entity.phoneNumber;
        dto.address = entity.address;
        dto.note = entity.note;
        dto.attachment = entity.attachment;
        dto.createdById = entity.createdById;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        return dto;
    }

    public static toCreateEntity(dto: CreateSupplierRequestDto): SupplierEntity {
        const entity = new SupplierEntity();
        entity.code = dto.code;
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.phoneNumber = dto.phoneNumber;
        entity.address = dto.address;
        entity.note = dto.note;
        entity.attachment = dto.attachment;
        entity.createdById = dto.createdById;

        return entity;
    }

    public static toUpdateEntity(entity: SupplierEntity, dto: UpdateSupplierRequestDto): SupplierEntity {
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.phoneNumber = dto.phoneNumber;
        entity.address = dto.address;
        entity.note = dto.note;
        entity.attachment = dto.attachment;

        return entity;
    }
}