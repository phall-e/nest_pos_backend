import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { UomModule } from './uom/uom.module';

@Module({
  imports: [CategoryModule, UomModule]
})
export class MasterDataModule {}
