import { Module } from '@nestjs/common';
import { StockAdjustmentService } from './stock-adjustment.service';
import { StockAdjustmentController } from './stock-adjustment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockAdjustmentEntity } from './entities/stock-adjustment.entity';
import { StockAdjustmentItemEntity } from './entities/stock-adjustment-item.entity';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockAdjustmentEntity,
      StockAdjustmentItemEntity,
    ]),
    StockModule,
  ],
  controllers: [StockAdjustmentController],
  providers: [StockAdjustmentService],
})
export class StockAdjustmentModule {}
