import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "@/database/entities/base.entity";
import { PurchaseOrderEntity } from "./purchase-order.entity";
import { ProductEntity } from "@/modules/admin/master-data/product/entities/product.entity";

@Entity({
    schema: 'admin',
    name: 'purchase_order_items',
})
export class PurchaseOrderItemEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'purchase_order_id',
        type: 'integer',
        nullable: false,
    })
    purchaseOrderId: number;

    @ManyToOne(() => PurchaseOrderEntity, { nullable: true })
    @JoinColumn({
        name: 'purchase_order_id',
    })
    purchaseOrder: PurchaseOrderEntity;

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
        name: 'note',
        type: 'varchar',
        length: '160',
        nullable: true,
    })
    note: string;

    constructor(partial?: Partial<PurchaseOrderItemEntity>){
        super();
        Object.assign(this, partial);
    }
    
    
}
