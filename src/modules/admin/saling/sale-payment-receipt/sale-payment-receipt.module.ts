import { Module } from '@nestjs/common';
import { SalePaymentReceiptController } from './sale-payment-receipt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalePaymentReceiptEntity } from './entities/sale-payment-receipt.entity';
import { SalePaymentReceiptService } from './sale-payment-receipt.service';
import { SaleEntity } from '../sale/entities/sale.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalePaymentReceiptEntity,
      SaleEntity,
    ]),
  ],
  controllers: [SalePaymentReceiptController],
  providers: [SalePaymentReceiptService],
})
export class SalePaymentReceiptModule {}
