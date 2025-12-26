import { Module } from '@nestjs/common';
import { PurchaseRequestService } from './purchase-request.service';
import { PurchaseRequestController } from './purchase-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseRequestEntity } from './entities/purchase-request.entity';
import { PurchaseRequestItemEntity } from './entities/purchase-request-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseRequestEntity,
      PurchaseRequestItemEntity,
    ])
  ],
  controllers: [PurchaseRequestController],
  providers: [PurchaseRequestService],
})
export class PurchaseRequestModule {}
