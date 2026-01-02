import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';
import { StockInModule } from './stock-in/stock-in.module';

@Module({
  imports: [StockModule, StockInModule]
})
export class StockingModule {}
