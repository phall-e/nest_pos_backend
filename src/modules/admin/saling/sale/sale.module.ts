import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleEntity } from './entities/sale.entity';
import { SaleItemEntity } from './entities/sale-item.entity';
import { StockModule } from '../../stocking/stock/stock.module';
import { SalePaymentReceiptModule } from '../sale-payment-receipt/sale-payment-receipt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SaleEntity,
      SaleItemEntity,
    ]),
    StockModule,
    SalePaymentReceiptModule,
  ],
  controllers: [SaleController],
  providers: [SaleService],
})
export class SaleModule {}
