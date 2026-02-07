import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePurchaseReceiptBillingRequestDto } from './create-purchase-receipt-billing-request.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdatePurchaseReceiptBillingRequestDto extends PartialType(CreatePurchaseReceiptBillingRequestDto) {
    @ApiProperty()
    @IsNotEmpty()
    code: string;
}
