import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "@/database/entities/base.entity";
import { PurchaseReceiptEntity } from "./purchase-receipt.entity";
import { ProductEntity } from "@/modules/admin/master-data/product/entities/product.entity";

@Entity({
    schema: 'admin',
    name: 'purchase_receipt_items',
})
export class PurchaseReceiptItemEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        name: 'id'
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
        name: 'product_id',
        type: 'integer',
        nullable: false,
    })
    productId: number;

    @ManyToOne(() => ProductEntity,  { nullable: true })
    @JoinColumn({
        name: 'product_id',
    })
    product: ProductEntity;

    @Column({
        name: 'quantity',
        type: 'decimal',
        precision: 14,
        scale: 2,
        default: 0,
        nullable: false,
    })
    quantity: number;

    @Column({
        name: 'unit_price',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
        nullable: false,
    })
    unitPrice: number;

    @Column({
        name: 'discount',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
        nullable: false,
    })
    discount: number;

    @Column({
        name: 'note',
        type: 'varchar',
        nullable: true,
    })
    note: string;

    constructor(partial?: Partial<PurchaseReceiptItemEntity>){
        super();
        Object.assign(this, partial);
    }

}
