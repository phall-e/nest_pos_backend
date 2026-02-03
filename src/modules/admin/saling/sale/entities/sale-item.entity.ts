import { BaseEntity } from "@/database/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SaleEntity } from "./sale.entity";
import { ProductEntity } from "@/modules/admin/master-data/product/entities/product.entity";

@Entity({
    schema: 'admin',
    name: 'sale_items',
})
export class SaleItemEntity extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'sale_id',
        type: 'integer',
        nullable: false,
    })
    saleId: number;

    @ManyToOne(() => SaleEntity, { nullable: true })
    @JoinColumn({
        name: 'sale_id',
    })
    sale: SaleEntity;

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
        nullable: false,
    })
    quantity: number;

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
        name: 'unit_price',
        type: 'decimal',
        precision: 14,
        scale: 5,
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

    constructor(partial?: Partial<SaleItemEntity>) {
        super();
        Object.assign(this, partial);
    }
}
