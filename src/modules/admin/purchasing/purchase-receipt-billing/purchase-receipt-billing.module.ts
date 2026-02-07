import { Module } from '@nestjs/common';
import { PurchaseReceiptBillingController } from './purchase-receipt-billing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseReceiptBillingEntity } from './entities/purchase-receipt-billing.entity';
import { PurchaseReceiptBillingService } from './purchase-receipt-billing.service';
import { PurchaseReceiptEntity } from '../purchase-receipt/entities/purchase-receipt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseReceiptBillingEntity,
      PurchaseReceiptEntity,
    ]),
  ],
  controllers: [PurchaseReceiptBillingController],
  providers: [PurchaseReceiptBillingService],
  exports: [PurchaseReceiptBillingService],
})
export class PurchaseReceiptBillingModule {}
