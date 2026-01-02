import { BaseEntity } from "@/database/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StockAdjustmentAttachment } from "../dto/attachement.dto";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { BranchEntity } from "@/modules/admin/master-data/branch/entities/branch.entity";
import { StockAdjustmentItemEntity } from "./stock-adjustment-item.entity";

@Entity({
    schema: 'admin',
    name: 'stock_adjustments',
})
export class StockAdjustmentEntity extends BaseEntity{
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
        name: 'adjustment_date',
        type: 'date',
        nullable: false,
    })
    adjustmentDate: Date;

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
        name: 'description',
        type: 'varchar',
        length: '160',
        nullable: false,
    })
    description: string;

    @Column({
        name: 'attachments',
        type: 'jsonb',
        nullable: true,
    })
    attachments: StockAdjustmentAttachment[];

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

    @OneToMany(() => StockAdjustmentItemEntity, (item) => item.stockAdjustment, { cascade: true })
    items: StockAdjustmentItemEntity[];

    constructor(partial?: Partial<StockAdjustmentEntity>) {
        super();
        Object.assign(this, partial);
    }
}
