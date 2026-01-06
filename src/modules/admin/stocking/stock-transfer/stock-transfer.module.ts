import { Module } from '@nestjs/common';
import { StockTransferService } from './stock-transfer.service';
import { StockTransferController } from './stock-transfer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockTransferEntity } from './entities/stock-transfer.entity';
import { StockTransferItemEntity } from './entities/stock-transfer-item.entity';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockTransferEntity,
      StockTransferItemEntity,
    ]),
    StockModule,
  ],
  controllers: [StockTransferController],
  providers: [StockTransferService],
})
export class StockTransferModule {}
