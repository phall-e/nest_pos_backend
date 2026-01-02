import { BaseEntity } from "@/database/entities/base.entity";
import { BranchEntity } from "@/modules/admin/master-data/branch/entities/branch.entity";
import { ProductEntity } from "@/modules/admin/master-data/product/entities/product.entity";
import { PurchaseReceiptEntity } from "@/modules/admin/purchasing/purchase-receipt/entities/purchase-receipt.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    schema: 'admin',
    name: 'stock_ins',
})
export class StockInEntity extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'purchase_receipt_id',
        type: 'integer',
        nullable: false,
    })
    purchaseReceiptId: number;

    @ManyToOne(() => PurchaseReceiptEntity, { nullable: true })
    @JoinColumn({
        name: 'purchase_receipt_id',
    })
    purchaseReceipt: PurchaseReceiptEntity;

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
        name: 'quantity',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
        nullable: false,
    })
    quantity: number;

    @Column({
        name: 'note',
        type: 'varchar',
        length: '160',
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

    constructor(partial?: Partial<StockInEntity>) {
        super();
        Object.assign(this, partial);
    }


}
