import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PurchaseRequestEntity } from "../../purchase-request/entities/purchase-request.entity";
import { BranchEntity } from "@/modules/admin/master-data/branch/entities/branch.entity";
import { SupplierEntity } from "@/modules/admin/master-data/supplier/entities/supplier.entity";
import { PurchaseOrderAttachment } from "../dto/attachement.dto";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { ModuleStatus } from "@/common/enums/status.enum";
import { BaseEntity } from "@/database/entities/base.entity";
import { PurchaseOrderItemEntity } from "./purchase-order-item.entity";

@Entity({
    schema: 'admin',
    name: 'purchase_orders',
})
export class PurchaseOrderEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'code',
        type: 'varchar',
        unique: true,
        length: '160',
        nullable: false,
    })
    code: string;

    @Column({
        name: 'order_date',
        type: 'date',
        nullable: false,
    })
    orderDate: Date;

    @Column({
        name: 'purchase_request_id',
        type: 'integer',
        nullable: false,
    })
    purchaseRequestId: number;

    @ManyToOne(() => PurchaseRequestEntity, { nullable: true })
    @JoinColumn({
        name: 'purchase_request_id',
    })
    purchaseRequest: PurchaseRequestEntity;

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
    attachments: PurchaseOrderAttachment[];

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
    approvedById: number;

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
        scale: 2,
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

    @OneToMany(() => PurchaseOrderItemEntity, (item) => item.purchaseOrder, { cascade: true })
    items: PurchaseOrderItemEntity[];

    constructor(partial?: Partial<PurchaseOrderEntity>){
        super();
        Object.assign(this, partial);
    }
    
    
}
