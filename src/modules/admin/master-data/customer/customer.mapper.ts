import { UserMapper } from "../../system/user/user.mapper";
import { CustomerTypeMapper } from "../customer-type/customer-type.mapper";
import { CreateCustomerRequestDto } from "./dto/create-customer-request.dto";
import { CustomerResponseDto } from "./dto/customer-response.dto";
import { UpdateCustomerRequestDto } from "./dto/update-customer-request.dto";
import { CustomerEntity } from "./entities/customer.entity";

export class CustomerMapper {
    public static async toDto(entity: CustomerEntity): Promise<CustomerResponseDto> {
        const dto = new CustomerResponseDto();
        dto.id = entity.id;
        dto.customerTypeId = entity.customerTypeId;
        dto.code = entity.code;
        dto.nameEn = entity.nameEn;
        dto.nameKh = entity.nameKh;
        dto.phoneNumber = entity.phoneNumber;
        dto.address = entity.address;
        dto.note = entity.note;
        dto.profile = entity.profile;
        dto.attachments = entity.attachments ? [...entity.attachments] : [];
        dto.createdById = entity.createdById;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.customerType) {
            dto.customerType = await CustomerTypeMapper.toDto(entity.customerType);
        }

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        return dto;
    }

    public static toCreateEntity(dto: CreateCustomerRequestDto): CustomerEntity {
        const entity = new CustomerEntity();
        entity.customerTypeId = dto.customerTypeId;
        entity.code = dto.code;
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.phoneNumber = dto.phoneNumber;
        entity.address = dto.address;
        entity.note = dto.note;
        entity.profile = dto.profile;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.createdById = dto.createdById;

        return entity;
    }

    public static toUpdateEntity(entity: CustomerEntity, dto: UpdateCustomerRequestDto): CustomerEntity {
        entity.customerTypeId = dto.customerTypeId;
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.phoneNumber = dto.phoneNumber;
        entity.address = dto.address;
        entity.note = dto.note;
        entity.profile = dto.profile;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];

        return entity;
    }
}