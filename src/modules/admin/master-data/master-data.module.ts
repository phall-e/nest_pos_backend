import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { UomModule } from './uom/uom.module';
import { ProductModule } from './product/product.module';
import { BranchModule } from './branch/branch.module';

@Module({
  imports: [CategoryModule, UomModule, ProductModule, BranchModule]
})
export class MasterDataModule {}
