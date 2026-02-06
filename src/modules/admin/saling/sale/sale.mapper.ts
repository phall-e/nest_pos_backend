import { ModuleStatus } from "@/common/enums/status.enum";
import { BranchMapper } from "../../master-data/branch/branch.mapper";
import { CustomerMapper } from "../../master-data/customer/customer.mapper";
import { UserMapper } from "../../system/user/user.mapper";
import { SalePaymentReceiptMapper } from "../sale-payment-receipt/sale-payment-receipt.mapper";
import { CreateSaleRequestDto } from "./dto/create-sale-request.dto";
import { SaleResponseDto } from "./dto/sale-response.dto";
import { UpdateSaleRequestDto } from "./dto/update-sale-request.dto";
import { SaleItemEntity } from "./entities/sale-item.entity";
import { SaleEntity } from "./entities/sale.entity";
import { SaleItemMapper } from "./sale-item.mapper";

export class SaleMapper {
    public static async toDto(entity: SaleEntity): Promise<SaleResponseDto> {
        
        const dto = new SaleResponseDto();

        dto.id = entity.id;
        dto.code = entity.code;
        dto.saleDate = entity.saleDate;
        dto.branchId = entity.branchId;
        dto.customerId = entity.customerId;
        dto.soleById = entity.soleById;
        dto.totalQuantity = entity.totalQuantity ? parseFloat(entity.totalQuantity as any) : null;
        dto.totalDiscount = entity.totalDiscount ? parseFloat(entity.totalDiscount as any) : null;
        dto.totalAmount = entity.totalAmount ? parseFloat(entity.totalAmount as any) : null;
        dto.totalPaidAmount = entity.totalPaidAmount ? parseFloat(entity.totalPaidAmount as any) : null;
        dto.attachments = entity.attachments ? [...entity.attachments] : [];
        dto.description = entity.description;
        dto.status = entity.status;
        dto.createdById = entity.createdById;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.branch) {
            dto.branch = await BranchMapper.toDto(entity.branch);
        }

        if (entity.customer) {
            dto.customer = await CustomerMapper.toDto(entity.customer);
        }

        if (entity.soleBy) {
            dto.soleBy = await UserMapper.toDto(entity.soleBy);
        }

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        if (entity.items && entity.items.length > 0) {
            dto.items = await Promise.all(
                entity.items.map((item) => SaleItemMapper.toDto(item)),
            );
        }

        if (entity.salePaymentReceipts && entity.salePaymentReceipts.length > 0) {
            dto.salePaymentReceipts = await Promise.all(
                entity.salePaymentReceipts.map((item) => SalePaymentReceiptMapper.toDto(item)),
            );
        }

        return dto;
        
    }

    public static toCreateEntity(dto: CreateSaleRequestDto): SaleEntity {
        
        const entity = new SaleEntity();
        entity.code = dto.code;
        entity.saleDate = dto.saleDate;
        entity.branchId = dto.branchId;
        entity.customerId = dto.customerId;
        entity.soleById = dto.soleById;
        entity.totalQuantity = dto.totalQuantity;
        entity.totalDiscount = dto.totalDiscount;
        entity.totalAmount = dto.totalAmount;
         entity.totalPaidAmount = dto.isPayNow
            ? entity.totalAmount - entity.totalDiscount
            : 0;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.description = dto.description;
        entity.status = dto.isPayNow ? ModuleStatus.PAID : ModuleStatus.PENDING;
        entity.createdById = dto.createdById;

        if (dto.items && dto.items.length > 0) {
            entity.items = dto.items.map((itemDto) => {
                const itemEntity = SaleItemMapper.toCreateEntity(itemDto);
                return itemEntity;
            });
        }

        return entity;
    }

    public static toUpdateEntity(entity: SaleEntity, dto: UpdateSaleRequestDto): SaleEntity {
    
        entity.saleDate = dto.saleDate;
        entity.branchId = dto.branchId;
        entity.customerId = dto.customerId;
        entity.soleById = dto.soleById;
        entity.totalQuantity = dto.totalQuantity;
        entity.totalDiscount = dto.totalDiscount;
        entity.totalAmount = dto.totalAmount;
        entity.totalPaidAmount = dto.totalPaidAmount;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.description = dto.description;
        entity.status = dto.status;

        if (dto.items && dto.items.length > 0) {
            entity.items = dto.items.map((itemDto) => {
                let itemEntity: SaleItemEntity | null = null;
                
                if (itemDto.id) {
                    itemEntity = SaleItemMapper.toUpdateEntity(
                        new SaleItemEntity({ id: itemDto.id }),
                        { ...itemDto },
                    );
                } else {
                    itemEntity = SaleItemMapper.toCreateEntity(itemDto);
                }

                itemEntity.sale = entity;
                return itemEntity;
            })
        }

        return entity;
        
    }
}