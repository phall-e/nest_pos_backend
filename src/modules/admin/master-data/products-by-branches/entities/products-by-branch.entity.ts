import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ProductEntity } from "../../product/entities/product.entity";
import { BranchEntity } from "../../branch/entities/branch.entity";
import { BaseEntity } from "@/database/entities/base.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";

@Entity({
    schema: 'admin',
    name: 'products_by_branches',
})
@Unique(['productId', 'branchId'])
export class ProductsByBranchesEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'product_id',
        type: 'integer',
        nullable: false,
    })
    productId: number;

    @ManyToOne(() => ProductEntity, (product) => product.productBranches, { 
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'product_id',
    })
    product: ProductEntity;

    @Column({
        name: 'branch_id',
        type: 'integer',
        nullable: false,
    })
    branchId: number;

    @ManyToOne(() => BranchEntity, (branch) => branch.productBranches, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'branch_id',
    })
    branch: BranchEntity;

    @Column({
        name: 'sale_price',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
        nullable: false,
    })
    salePrice: number;

    @Column({
        name: 'note',
        type: 'varchar',
        length: '150',
        nullable: true,
    })
    note: string;

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

    constructor(partial?: Partial<ProductsByBranchesEntity>) {
        super();
        Object.assign(this, partial);
    }
}
