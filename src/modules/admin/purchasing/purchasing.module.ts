import { Module } from '@nestjs/common';
import { PurchaseRequestModule } from './purchase-request/purchase-request.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { PurchaseReceiptModule } from './purchase-receipt/purchase-receipt.module';

@Module({
  imports: [PurchaseRequestModule, PurchaseOrderModule, PurchaseReceiptModule]
})
export class PurchasingModule {}
