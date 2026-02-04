import { ModuleStatus } from "@/common/enums/status.enum";
import { BaseEntity } from "@/database/entities/base.entity";
import { CustomerEntity } from "@/modules/admin/master-data/customer/entities/customer.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SaleAttachment } from "../dto/attachement.dto";
import { SaleItemEntity } from "./sale-item.entity";
import { BranchEntity } from "@/modules/admin/master-data/branch/entities/branch.entity";
import { SalePaymentReceiptEntity } from "../../sale-payment-receipt/entities/sale-payment-receipt.entity";

@Entity({
    schema: 'admin',
    name: 'sales',
})
export class SaleEntity extends BaseEntity {
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
        name: 'sale_date',
        type: 'date',
        nullable: false,
    })
    saleDate: Date;

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
        name: 'customer_id',
        type: 'integer',
        nullable: false,
    })
    customerId: number;

    @ManyToOne(() => CustomerEntity, { nullable: true })
    @JoinColumn({
        name: 'customer_id',
    })
    customer: CustomerEntity;

    @Column({
        name: 'sole_by_id',
        type: 'integer',
        nullable: false,
    })
    soleById: number;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({
        name: 'sole_by_id',
    })
    soleBy: UserEntity;

    @Column({
        name: 'total_quantity',
        type: 'decimal',
        precision: 14,
        scale: 5,
        nullable: false,
    })
    totalQuantity: number;

    @Column({
        name: 'total_discount',
        type: 'decimal',
        precision: 14,
        scale: 5,
        nullable: false,
    })
    totalDiscount: number;

    @Column({
        name: 'total_amount',
        type: 'decimal',
        precision: 14,
        scale: 5,
        nullable: false,
    })
    totalAmount: number;

    @Column({
        name: 'total_paid_amount',
        type: 'decimal',
        precision: 14,
        scale: 5,
        nullable: false,
    })
    totalPaidAmount: number;

    @Column({
        name: 'attachments',
        type: 'jsonb',
        nullable: true,
    })
    attachments: SaleAttachment[];

    @Column({
        name: 'description',
        type: 'varchar',
        length: '160',
        nullable: true,
    })
    description: string;

    @Column({
        name: 'status',
        type: 'varchar',
        length: '30',
        default: `'${ModuleStatus.PENDING}'`,
        nullable: false,
    })
    status: string;

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

    @OneToMany(() => SaleItemEntity, (item) => item.sale, { cascade: true })
    items: SaleItemEntity[];

    @OneToMany(() => SalePaymentReceiptEntity, (item) => item.sale, { cascade: true })
    salePaymentReceipts: SalePaymentReceiptEntity[];

    constructor(partial?: Partial<SaleEntity>) {
        super();
        Object.assign(this, partial);
    }
}
