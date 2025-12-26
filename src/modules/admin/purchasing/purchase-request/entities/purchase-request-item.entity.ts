import { BaseEntity } from "@/database/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PurchaseRequestEntity } from "./purchase-request.entity";
import { ProductEntity } from "@/modules/admin/master-data/product/entities/product.entity";

@Entity({
    schema: 'admin',
    name: 'purchase_request_items',
})

export class PurchaseRequestItemEntity extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id'
    })
    id: number;

    @Column({
        name: 'purchase_request_id',
        type: 'integer',
        nullable: false,
    })
    purchaseRequestId: number;

    @ManyToOne(() => PurchaseRequestEntity, { nullable: true })
    @JoinColumn({
        name: 'purchase_request_id'
    })
    purchaseRequest: PurchaseRequestEntity;

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
        name: 'note',
        type: 'varchar',
        length: '150',
        nullable: true,
    })
    note: string;

    constructor(partial?: Partial<PurchaseRequestItemEntity>) {
        super();
        Object.assign(this, partial);
    }
}