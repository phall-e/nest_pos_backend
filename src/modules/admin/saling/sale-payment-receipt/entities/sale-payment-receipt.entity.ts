import { BaseEntity } from "@/database/entities/base.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SalePaymentReceiptAttachment } from "../dto/attachement.dto";
import { SaleEntity } from "../../sale/entities/sale.entity";

@Entity({
    schema: 'admin',
    name: 'sale_payment_receipts',
})
export class SalePaymentReceiptEntity extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'code',
        type: 'varchar',
        length: '160',
        unique: true,
        nullable: false,
    })
    code: string;

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

    @Column({
        name: 'receipt_by_id',
        type: 'integer',
        nullable: false,
    })
    receiptById: number;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({
        name: 'receipt_by_id',
    })
    receiptBy: UserEntity;

    @Column({
        name: 'receipt_date',
        type: 'date',
        nullable: false,
    })
    receiptDate: Date;

    @Column({
        name: 'amount',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
        nullable: false,
    })
    amount: number;

    @Column({
        name: 'attachments',
        type: 'jsonb',
        nullable: true,
    })
    attachments: SalePaymentReceiptAttachment[];

    @Column({
        name: 'note',
        type: 'varchar',
        length: '160',
        nullable: true,
    })
    note: string;

    constructor(partial?: Partial<SalePaymentReceiptEntity>) {
        super();
        Object.assign(this, partial);
    }
}
