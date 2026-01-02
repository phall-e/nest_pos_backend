import { BaseEntity } from "@/database/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StockAdjustmentEntity } from "./stock-adjustment.entity";
import { ProductEntity } from "@/modules/admin/master-data/product/entities/product.entity";

@Entity({
    schema: 'admin',
    name: 'stock_adjustment_items',
})
export class StockAdjustmentItemEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'stock_adjustment_id',
        type: 'integer',
        nullable: false,
    })
    stockAdjustmentId: number;

    @ManyToOne(() => StockAdjustmentEntity, { nullable: true })
    @JoinColumn({
        name: 'stock_adjustment_id',
    })
    stockAdjustment: StockAdjustmentEntity;

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
        nullable: false,
    })
    note: string;

    constructor(partial?: Partial<StockAdjustmentItemEntity>) {
        super();
        Object.assign(this, partial);
    }
}
