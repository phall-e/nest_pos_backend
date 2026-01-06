import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StockTransferEntity } from "./stock-transfer.entity";
import { ProductEntity } from "@/modules/admin/master-data/product/entities/product.entity";
import { BaseEntity } from "@/database/entities/base.entity";

@Entity({
    schema: 'admin',
    name: 'stock_transfer_items'
})
export class StockTransferItemEntity extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'stock_transfer_id',
        type: 'integer',
        nullable: false,
    })
    stockTransferId: number;

    @ManyToOne(() => StockTransferEntity, { nullable: true })
    @JoinColumn({
        name: 'stock_transfer_id',
    })
    stockTransfer: StockTransferEntity;

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

    constructor(partial?: Partial<StockTransferItemEntity>) {
        super();
        Object.assign(this, partial);
    }
}