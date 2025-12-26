import { PartialType } from '@nestjs/swagger';
import { CreatePurchaseRequestRequestDto } from './create-purchase-request-request.dto';

export class UpdatePurchaseRequestRequestDto extends PartialType(CreatePurchaseRequestRequestDto) {}
