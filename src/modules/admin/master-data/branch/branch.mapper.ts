import { UserMapper } from "../../system/user/user.mapper";
import { BranchResponseDto } from "./dto/branch-response.dto";
import { CreateBranchRequestDto } from "./dto/create-branch-request.dto";
import { UpdateBranchRequestDto } from "./dto/update-branch-request.dto";
import { BranchEntity } from "./entities/branch.entity";

export class BranchMapper {
    public static async toDto(entity: BranchEntity): Promise<BranchResponseDto> {
        const dto = new BranchResponseDto();
        dto.id = entity.id;
        dto.code = entity.code;
        dto.nameEn = entity.nameEn;
        dto.nameKh = entity.nameKh;
        dto.managerName = entity.managerName;
        dto.phoneNumber = entity.phoneNumber;
        dto.address = entity.address;
        dto.createdById = entity.createdById;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        return dto;
    }

    public static toCreateEntity(dto: CreateBranchRequestDto): BranchEntity {
        const entity = new BranchEntity();
        entity.code = dto.code;
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.managerName = dto.managerName;
        entity.phoneNumber = dto.phoneNumber;
        entity.address = dto.address;
        entity.createdById = dto.createdbyId;

        return entity;
    }

    public static toUpdateEntity(entity: BranchEntity, dto: UpdateBranchRequestDto): BranchEntity {
        entity.code = dto.code;
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.managerName = dto.managerName;
        entity.phoneNumber = dto.phoneNumber;
        entity.address = dto.address;
        entity.updatedAt = new Date();

        return entity;
    }
}