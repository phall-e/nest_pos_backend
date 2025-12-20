import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { UomModule } from './uom/uom.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [CategoryModule, UomModule, ProductModule]
})
export class MasterDataModule {}
