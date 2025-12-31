import { PartialType } from '@nestjs/swagger';
import { CreatePurchaseReceiptRequestDto } from './create-purchase-receipt-resquest.dto';

export class UpdatePurchaseReceiptRequestDto extends PartialType(CreatePurchaseReceiptRequestDto) {}
