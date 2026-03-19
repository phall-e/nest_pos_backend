import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleEntity } from '../saling/sale/entities/sale.entity';
import { PurchaseReceiptEntity } from '../purchasing/purchase-receipt/entities/purchase-receipt.entity';
import { PurchaseOrderEntity } from '../purchasing/purchase-order/entities/purchase-order.entity';
import { BranchEntity } from '../master-data/branch/entities/branch.entity';
import { UserEntity } from '../system/user/entities/user.entity';
import { SupplierEntity } from '../master-data/supplier/entities/supplier.entity';
import { CustomerEntity } from '../master-data/customer/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SaleEntity,
      PurchaseReceiptEntity,
      PurchaseOrderEntity,
      BranchEntity,
      UserEntity,
      SupplierEntity,
      CustomerEntity,
    ]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController]
})
export class DashboardModule {}
