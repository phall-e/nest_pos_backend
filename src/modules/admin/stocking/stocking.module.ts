import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';
import { StockInModule } from './stock-in/stock-in.module';
import { StockAdjustmentModule } from './stock-adjustment/stock-adjustment.module';
import { StockTransferModule } from './stock-transfer/stock-transfer.module';

@Module({
  imports: [StockModule, StockInModule, StockAdjustmentModule, StockTransferModule]
})
export class StockingModule {}
