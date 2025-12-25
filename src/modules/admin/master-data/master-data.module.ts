import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { UomModule } from './uom/uom.module';
import { ProductModule } from './product/product.module';
import { BranchModule } from './branch/branch.module';
import { ProductsByBranchesModule } from './products-by-branches/products-by-branches.module';
import { SupplierModule } from './supplier/supplier.module';

@Module({
  imports: [CategoryModule, UomModule, ProductModule, BranchModule, ProductsByBranchesModule, SupplierModule]
})
export class MasterDataModule {}
