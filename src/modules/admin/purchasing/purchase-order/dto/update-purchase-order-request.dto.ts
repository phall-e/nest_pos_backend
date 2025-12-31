import { PartialType } from '@nestjs/swagger';
import { CreatePurchaseOrderRequestDto } from './create-purchase-order-request.dto';

export class UpdatePurchaseOrderRequestDto extends PartialType(CreatePurchaseOrderRequestDto) {}
