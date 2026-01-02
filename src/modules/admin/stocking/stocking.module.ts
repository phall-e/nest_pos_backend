import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';
import { StockInModule } from './stock-in/stock-in.module';
import { StockAdjustmentModule } from './stock-adjustment/stock-adjustment.module';

@Module({
  imports: [StockModule, StockInModule, StockAdjustmentModule]
})
export class StockingModule {}
