import { UserMapper } from "../../system/user/user.mapper";
import { PurchaseReceiptMapper } from "../purchase-receipt/purchase-receipt.mapper";
import { CreatePurchaseReceiptBillingRequestDto } from "./dto/create-purchase-receipt-billing-request.dto";
import { PurchaseReceiptBillingResponseDto } from "./dto/purchase-receipt-billing-response.dto";
import { UpdatePurchaseReceiptBillingRequestDto } from "./dto/update-purchase-receipt-billing-request.dto";
import { PurchaseReceiptBillingEntity } from "./entities/purchase-receipt-billing.entity";

export class PurchaseReceiptBillingMapper {
    public static async toDto(entity: PurchaseReceiptBillingEntity): Promise<PurchaseReceiptBillingResponseDto> {
        
        const dto = new PurchaseReceiptBillingResponseDto();

        dto.id = entity.id;
        dto.code = entity.code;
        dto.purchaseReceiptId = entity.purchaseReceiptId;
        dto.billingById = entity.billingById;
        dto.billingDate = entity.billingDate;
        dto.amount = entity.amount ? parseFloat(entity.amount as any) : 0;
        dto.attachments = entity.attachments ? [...entity.attachments] : [];
        dto.note = entity.note;
        dto.createdById = entity.createdById;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.purchaseReceipt) {
            dto.purchaseReceipt = await PurchaseReceiptMapper.toDto(entity.purchaseReceipt);
        }

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        if (entity.billingBy) {
            dto.billingBy = await UserMapper.toDto(entity.billingBy);
        }

        return dto;
        
    }

    public static toCreateEntity(dto: CreatePurchaseReceiptBillingRequestDto): PurchaseReceiptBillingEntity {
        
        const entity = new PurchaseReceiptBillingEntity();
        entity.code = dto.code;
        entity.purchaseReceiptId = dto.purchaseReceiptId;
        entity.billingById = dto.billingById;
        entity.billingDate = dto.billingDate;
        entity.amount = dto.amount;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.note = dto.note;
        entity.createdById = dto.createdById;

        return entity;
    }

    public static toUpdateEntity(entity: PurchaseReceiptBillingEntity, dto: UpdatePurchaseReceiptBillingRequestDto): PurchaseReceiptBillingEntity {
    
        entity.purchaseReceiptId = dto.purchaseReceiptId;
        entity.billingById = dto.billingById;
        entity.billingDate = dto.billingDate;
        entity.amount = dto.amount;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.note = dto.note;

        return entity;
        
    }
}