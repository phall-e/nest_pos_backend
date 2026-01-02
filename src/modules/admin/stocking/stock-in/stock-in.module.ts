import { Module } from '@nestjs/common';
import { StockInService } from './stock-in.service';
import { StockInController } from './stock-in.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockInEntity } from './entities/stock-in.entity';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockInEntity,
    ]),
    StockModule,
  ],
  controllers: [StockInController],
  providers: [StockInService],
})
export class StockInModule {}
