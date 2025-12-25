import { Module } from '@nestjs/common';
import { ProductsByBranchesService } from './products-by-branches.service';
import { ProductsByBranchesController } from './products-by-branches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsByBranchesEntity } from './entities/products-by-branch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductsByBranchesEntity])
  ],
  controllers: [ProductsByBranchesController],
  providers: [ProductsByBranchesService],
})
export class ProductsByBranchesModule {}
