import { BranchMapper } from "../../master-data/branch/branch.mapper";
import { UserMapper } from "../../system/user/user.mapper";
import { CreatePurchaseRequestRequestDto } from "./dto/create-purchase-request-request.dto";
import { PurchaseRequestResponseDto } from "./dto/purchase-request-response.dto";
import { UpdatePurchaseRequestRequestDto } from "./dto/update-purchase-request.dto";
import { PurchaseRequestItemEntity } from "./entities/purchase-request-item.entity";
import { PurchaseRequestEntity } from "./entities/purchase-request.entity";
import { PurchaseRequestItemMapper } from "./purchase-request-item.mapper";

export class PurchaseRequestMapper {
    public static async toDto(entity: PurchaseRequestEntity): Promise<PurchaseRequestResponseDto> {
        const dto = new PurchaseRequestResponseDto();
        dto.id = entity.id;
        dto.code = entity.code;
        dto.requestDate = entity.requestDate;
        dto.branchId = entity.branchId;
        dto.description = entity.description;
        dto.attachments = entity.attachments ? [...entity.attachments] : [];
        dto.createdById = entity.createdById;
        dto.status = entity.status;
        dto.approvedById = entity.approvedById;
        dto.totalQuantity = entity.totalQuantity ? parseFloat(entity.totalQuantity as any) : null;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.branch) {
            dto.branch = await BranchMapper.toDto(entity.branch);
        }

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        if (entity.approvedBy) {
            dto.approvedBy = await UserMapper.toDto(entity.approvedBy);
        }

        if (entity.items && entity.items.length > 0) {
            dto.items = await Promise.all(
                entity.items.map((item) => PurchaseRequestItemMapper.toDto(item)),
            );
        }

        return dto;
    }

    public static toCreateEntity(dto: CreatePurchaseRequestRequestDto): PurchaseRequestEntity {
        const entity = new PurchaseRequestEntity();
        entity.code = dto.code;
        entity.requestDate = dto.requestDate;
        entity.branchId = dto.branchId;
        entity.description = dto.description;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.status = dto.status;
        entity.createdById = dto.createdById;
        
        if (dto.items && dto.items.length > 0) {
            entity.items = dto.items.map((itemDto) => {
                const itemEntity = PurchaseRequestItemMapper.toCreateEntity(itemDto);
                return itemEntity;
            });
        }

        return entity;
    }

    public static toUpdateEntity(entity: PurchaseRequestEntity, dto: UpdatePurchaseRequestRequestDto): PurchaseRequestEntity {
        entity.requestDate = dto.requestDate;
        entity.branchId = dto.branchId;
        entity.description = dto.description;
        entity.attachments = dto.attachments
        ? [...dto.attachments]
        : entity.attachments;
        entity.status = dto.status;

        if (dto.items && dto.items.length > 0) {
            entity.items = dto.items.map((itemDto) => {
                let itemEntity: PurchaseRequestItemEntity | null = null;

                if (itemDto.id) {
                    itemEntity = PurchaseRequestItemMapper.toUpdateEntity(new PurchaseRequestItemEntity, itemDto);
                } else {
                    itemEntity = PurchaseRequestItemMapper.toCreateEntity(itemDto);
                }

                itemEntity.purchaseRequest = entity;
                return itemEntity;
            });
        }

        return entity;
    }
}