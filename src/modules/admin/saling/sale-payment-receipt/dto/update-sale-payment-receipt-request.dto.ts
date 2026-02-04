import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSalePaymentReceiptRequestDto } from './create-sale-payment-receipt-request.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateSalePaymentReceiptRequestDto extends PartialType(CreateSalePaymentReceiptRequestDto) {
    @ApiProperty()
    @IsNotEmpty()
    code: string;
}
