import { Module } from '@nestjs/common';
import { SaleModule } from './sale/sale.module';
import { SalePaymentReceiptModule } from './sale-payment-receipt/sale-payment-receipt.module';

@Module({
  imports: [
    SaleModule,
    SalePaymentReceiptModule,
  ]
})
export class SalingModule {}
