import { BranchEntity } from "@/modules/admin/master-data/branch/entities/branch.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StockTransferAttachment } from "../dto/attachement.dto";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { BaseEntity } from "@/database/entities/base.entity";
import { StockTransferItemEntity } from "./stock-transfer-item.entity";

@Entity({
    schema: 'admin',
    name: 'stock_transfers',
})
export class StockTransferEntity extends BaseEntity{
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
        name: 'transfer_date',
        type: 'date',
        nullable: false,
    })
    transferDate: Date;

    @Column({
        name: 'from_branch_id',
        type: 'integer',
        nullable: false,
    })
    fromBranchId: number;

    @ManyToOne(() => BranchEntity, { nullable: true })
    @JoinColumn({
        name: 'from_branch_id',
    })
    fromBranch: BranchEntity;

    @Column({
        name: 'to_branch_id',
        type: 'integer',
        nullable: false,
    })
    toBranchId: number;

    @ManyToOne(() => BranchEntity, { nullable: true })
    @JoinColumn({
        name: 'to_branch_id',
    })
    toBranch: BranchEntity;

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
        name: 'attachments',
        type: 'jsonb',
        nullable: true,
    })
    attachments: StockTransferAttachment[];

    @Column({
        name: 'description',
        type: 'varchar',
        nullable: false,
    })
    description: string;

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

    @OneToMany(() => StockTransferItemEntity, (item) => item.stockTransfer, { cascade: true })
    items: StockTransferItemEntity[];

    constructor(partial?: Partial<StockTransferEntity>){
        super();
        Object.assign(this, partial);
    }
}
