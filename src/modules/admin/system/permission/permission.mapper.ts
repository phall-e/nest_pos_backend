import { CreatePermissionRequestDto } from "./dto/create-permission-request.dto";
import { PermissionResponseDto } from "./dto/permission-response.dto";
import { UpdatePermissionRequestDto } from "./dto/update-permission-request.dto";
import { PermissionEntity } from "./entities/permission.entity";

export class PermissionMapper {
    public static async toDto(entity: PermissionEntity): Promise<PermissionResponseDto> {
        const dto = new PermissionResponseDto();
        dto.id = entity.id; 
        dto.name = entity.name;
        dto.description = entity.description;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        return dto;
    }

    public static toDtoList(entities: PermissionEntity[]): Promise<PermissionResponseDto[]> {
        return Promise.all(entities.map((item) => this.toDto(item)));
    }

    public static toCreateEntity(dto: CreatePermissionRequestDto): PermissionEntity {
        const entity = new PermissionEntity();
        entity.name = dto.name;
        entity.description = dto.description;

        return entity;
    }

    public static toUpdateEntity(
        entity: PermissionEntity,
        dto: UpdatePermissionRequestDto,
    ): PermissionEntity {
        entity.name = dto.name;
        entity.description = dto.description;

        return entity;
    }
}