import { BaseEntity } from "@/database/entities/base.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PurchaseReceiptEntity } from "../../purchase-receipt/entities/purchase-receipt.entity";
import { PurchaseReceiptBillingAttachment } from "../dto/attachement.dto";

@Entity({
    schema: 'admin',
    name: 'purchase_receipt_billings',
})
export class PurchaseReceiptBillingEntity extends BaseEntity {
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
        name: 'billing_by_id',
        type: 'integer',
        nullable: false,
    })
    billingById: number;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({
        name: 'billing_by_id',
    })
    billingBy: UserEntity;

    @Column({
        name: 'billing_date',
        type: 'date',
        nullable: false,
    })
    billingDate: Date;

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
    attachments: PurchaseReceiptBillingAttachment[];

    @Column({
        name: 'note',
        type: 'varchar',
        length: '160',
        nullable: true,
    })
    note: string;

    constructor(partial?: Partial<PurchaseReceiptBillingEntity>) {
        super();
        Object.assign(this, partial);
    }
}
