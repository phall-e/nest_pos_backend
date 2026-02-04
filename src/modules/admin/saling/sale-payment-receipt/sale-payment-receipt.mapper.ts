import { UserMapper } from "../../system/user/user.mapper";
import { SaleMapper } from "../sale/sale.mapper";
import { CreateSalePaymentReceiptRequestDto } from "./dto/create-sale-payment-receipt-request.dto";
import { SalePaymentReceiptResponseDto } from "./dto/sale-payment-receipt-response.dto";
import { UpdateSalePaymentReceiptRequestDto } from "./dto/update-sale-payment-receipt-request.dto";
import { SalePaymentReceiptEntity } from "./entities/sale-payment-receipt.entity";

export class SalePaymentReceiptMapper {
    public static async toDto(entity: SalePaymentReceiptEntity): Promise<SalePaymentReceiptResponseDto> {
        
        const dto = new SalePaymentReceiptResponseDto();

        dto.id = entity.id;
        dto.code = entity.code;
        dto.saleId = entity.saleId;
        dto.receiptById = entity.receiptById;
        dto.receiptDate = entity.receiptDate;
        dto.amount = entity.amount ? parseFloat(entity.amount as any) : 0;
        dto.attachments = entity.attachments ? [...entity.attachments] : [];
        dto.note = entity.note;
        dto.createdById = entity.createdById;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.sale) {
            dto.sale = await SaleMapper.toDto(entity.sale);
        }

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        if (entity.receiptBy) {
            dto.receiptBy = await UserMapper.toDto(entity.receiptBy);
        }

        return dto;
        
    }

    public static toCreateEntity(dto: CreateSalePaymentReceiptRequestDto): SalePaymentReceiptEntity {
        
        const entity = new SalePaymentReceiptEntity();
        entity.code = dto.code;
        entity.saleId = dto.saleId;
        entity.receiptById = dto.receiptById;
        entity.receiptDate = dto.receiptDate;
        entity.amount = dto.amount;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.note = dto.note;
        entity.createdById = dto.createdById;

        return entity;
    }

    public static toUpdateEntity(entity: SalePaymentReceiptEntity, dto: UpdateSalePaymentReceiptRequestDto): SalePaymentReceiptEntity {
    
        entity.saleId = dto.saleId;
        entity.receiptById = dto.receiptById;
        entity.receiptDate = dto.receiptDate;
        entity.amount = dto.amount;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.note = dto.note;

        return entity;
        
    }
}