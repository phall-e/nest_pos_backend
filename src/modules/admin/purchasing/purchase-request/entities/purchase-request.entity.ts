import { BaseEntity } from "@/database/entities/base.entity";
import { BranchEntity } from "@/modules/admin/master-data/branch/entities/branch.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PurchaseRequestItemEntity } from "./purchase-request-item.entity";
import { PurchaseRequestAttachment } from "../dto/attachement.dto";
import { ModuleStatus } from "@/common/enums/status.enum";

@Entity({
    schema: 'admin',
    name: 'purchase_requests'
})
export class PurchaseRequestEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'code',
        type: 'varchar',
        length: '150',
        unique: true,
        nullable: false,
    })
    code: string;

    @Column({
        name: 'request_date',
        type: 'date',
        nullable: false,
    })
    requestDate: Date;

    @Column({
        name: 'branch_id',
        type: 'integer',
        nullable: false,
    })
    branchId: number;

    @ManyToOne(() => BranchEntity, { nullable: true })
    @JoinColumn({
        name: 'branch_id'
    })
    branch: BranchEntity;

    @Column({
        name: 'description',
        type: 'varchar',
        length: '160',
        nullable: true,
    })
    description: string;

    @Column({
        name: 'attachments',
        type: 'jsonb',
        nullable: true,
    })
    attachments: PurchaseRequestAttachment[];

    @Column({
        name: 'created_by_id',
        type: 'integer',
        nullable: false,
    })
    createdById: number;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({
        name: 'created_by_id'
    })
    createdBy: UserEntity;

    @Column({
        name: 'approved_by_id',
        type: 'integer',
        nullable: true,
    })
    approvedById: number;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({
        name: 'approved_by_id'
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

    @OneToMany(() => PurchaseRequestItemEntity, (item) => item.purchaseRequest, { cascade: true })
    items: PurchaseRequestItemEntity[];

    constructor(partial?: Partial<PurchaseRequestEntity>){
        super();
        Object.assign(this, partial);
    }

}
