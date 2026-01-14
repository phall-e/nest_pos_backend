import { UserMapper } from "../../system/user/user.mapper";
import { CreateCustomerTypeRequestDto } from "./dto/create-customer-type-request.dto";
import { CustomerTypeResponseDto } from "./dto/customer-type-response.dto";
import { UpdateCustomerTypeRequestDto } from "./dto/update-customer-type-request.dto";
import { CustomerTypeEntity } from "./entities/customer-type.entity";

export class CustomerTypeMapper {
    public static async toDto(entity: CustomerTypeEntity): Promise<CustomerTypeResponseDto> {
        const dto = new CustomerTypeResponseDto();
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

    public static toCreateEntity(dto: CreateCustomerTypeRequestDto): CustomerTypeEntity {
        const entity = new CustomerTypeEntity();
        entity.code = dto.code;
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.createdById = dto.createdById;

        return entity;
    }

    public static toUpdateEntity(entity: CustomerTypeEntity, dto: UpdateCustomerTypeRequestDto): CustomerTypeEntity {
        entity.code = dto.code;
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.updatedAt = new Date();

        return entity;
    }
}