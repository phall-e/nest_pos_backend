import { Module } from '@nestjs/common';
import { PurchaseReceiptService } from './purchase-receipt.service';
import { PurchaseReceiptController } from './purchase-receipt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseReceiptEntity } from './entities/purchase-receipt.entity';
import { PurchaseReceiptItemEntity } from './entities/purchase-receipt-item.entity';
import { PurchaseOrderEntity } from '../purchase-order/entities/purchase-order.entity';
import { PurchaseReceiptBillingModule } from '../purchase-receipt-billing/purchase-receipt-billing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseReceiptEntity,
      PurchaseReceiptItemEntity,
      PurchaseOrderEntity,
    ]),
    PurchaseReceiptBillingModule,
  ],
  controllers: [PurchaseReceiptController],
  providers: [PurchaseReceiptService],
})
export class PurchaseReceiptModule {}
