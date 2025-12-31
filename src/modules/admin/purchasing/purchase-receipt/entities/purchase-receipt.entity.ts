import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PurchaseOrderEntity } from "../../purchase-order/entities/purchase-order.entity";
import { BranchEntity } from "@/modules/admin/master-data/branch/entities/branch.entity";
import { SupplierEntity } from "@/modules/admin/master-data/supplier/entities/supplier.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { ModuleStatus } from "@/common/enums/status.enum";
import { BaseEntity } from "@/database/entities/base.entity";
import { PurchaseReceiptItemEntity } from "./purchase-receipt-item.entity";
import { PurchaseReceiptAttachment } from "../dto/attachement.dto";

@Entity({
    schema: 'admin',
    name: 'purchase_receipts',
})
export class PurchaseReceiptEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        name: 'id'
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
        name: 'receipt_date',
        type: 'date',
        nullable: false,
    })
    receiptDate: Date;

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
        name: 'branch_id',
        type: 'integer',
        nullable: false,
    })
    branchId: number;

    @ManyToOne(() => BranchEntity,  { nullable: true })
    @JoinColumn({
        name: 'branch_id',
    })
    branch: BranchEntity;

    @Column({
        name: 'supplier_id',
        type: 'integer',
        nullable: false,
    })
    supplierId: number;

    @ManyToOne(() => SupplierEntity, { nullable: true })
    @JoinColumn({
        name: 'supplier_id',
    })
    supplier: SupplierEntity;

    @Column({
        name: 'receipt_ref',
        type: 'varchar',
        length: '160',
        nullable: false,
    })
    receiptRef: string;

    @Column({
        name: 'description',
        type: 'varchar',
        length: '160',
        nullable: true,
    })
    description: string;

    @Column({
        name: 'reason',
        type: 'varchar',
        length: '160',
        nullable: true,
    })
    reason: string;

    @Column({
        name: 'attachments',
        type: 'jsonb',
        nullable: true,
    })
    attachments: PurchaseReceiptAttachment[];

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
        name: 'approved_by_id',
        type: 'integer',
        nullable: false,
    })
    approveedById: number;
    
    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({
        name: 'approved_by_id',
    })
    approvedBy: UserEntity;

    @Column({
        name: 'status',
        type: 'varchar',
        length: '30',
        default: `'${ModuleStatus.PENDING}'`,
        nullable: false,
    })
    status: string;

    @Column({
        name: 'total_quantity',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
        nullable: false,
    })
    totalQuantity: number;

    @Column({
        name: 'total_amount',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
        nullable: false,
    })
    totalAmount: number;

    @Column({
        name: 'total_net_amount',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
        nullable: false,
    })
    totalNetAmount: number;

    @Column({
        name: 'total_discount',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
        nullable: false,
    })
    totalDiscount: number;

    @OneToMany(() => PurchaseReceiptItemEntity, (item) => item.purchaseReceipt)
    items: PurchaseReceiptItemEntity[];

    constructor(partial?: Partial<PurchaseReceiptEntity>){
        super();
        Object.assign(this, partial);
    }

}
