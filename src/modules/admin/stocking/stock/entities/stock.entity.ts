import { BaseEntity } from "@/database/entities/base.entity";
import { BranchEntity } from "@/modules/admin/master-data/branch/entities/branch.entity";
import { ProductEntity } from "@/modules/admin/master-data/product/entities/product.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({
    schema: 'admin',
    name: 'stocks',
})
@Unique(['branchId', 'productId'])
export class StockEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'branch_id',
        type: 'integer',
        nullable: false,
    })
    branchId: number;

    @ManyToOne(() => BranchEntity, { nullable: true })
    @JoinColumn({
        name: 'branch_id',
    })
    branch: BranchEntity;

    @Column({
        name: 'product_id',
        type: 'integer',
        nullable: false,
    })
    productId: number;

    @ManyToOne(() => ProductEntity, { nullable: true })
    @JoinColumn({
        name: 'product_id',
    })
    product: ProductEntity;

    @Column({
        name: 'min_stock',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
        nullable: false,
    })
    minStock: number;

    @Column({
        name: 'stock_in',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
        nullable: false,
    })
    stockIn: number;

    @Column({
        name: 'stock_adjustment',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
        nullable: false,
    })
    stockAdjustment: number;

    @Column({
        name: 'stock_transfer',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
        nullable: false,
    })
    stockTransfer: number;

    @Column({
        name: 'stock_out',
        type: 'decimal',
        precision: 14,
        scale: 5,
    })
    stockOut: number;

    @Column({
        name: 'created_by_id',
        type: 'integer',
        nullable: false,
    })
    createdById: number;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({
        name: 'created_by_id',
    })
    createdBy: UserEntity;

    constructor(partial?: Partial<StockEntity>){
        super();
        Object.assign(this, partial);
    }
}
