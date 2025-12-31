import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderController } from './purchase-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderEntity } from './entities/purchase-order.entity';
import { PurchaseOrderItemEntity } from './entities/purchase-order-item.entity';
import { PurchaseRequestEntity } from '../purchase-request/entities/purchase-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseOrderEntity,
      PurchaseOrderItemEntity,
      PurchaseRequestEntity,
    ])
  ],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
