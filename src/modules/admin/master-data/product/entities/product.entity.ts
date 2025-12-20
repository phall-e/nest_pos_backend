import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CategoryEntity } from "../../category/entities/category.entity";
import { UomEntity } from "../../uom/entities/uom.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { BaseEntity } from "@/database/entities/base.entity";

@Entity({
    schema: 'admin',
    name: 'products',
})
export class ProductEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        name: 'id'
    })
    id: number;

    @Column({
        name: 'code',
        type: 'varchar',
        length: '150',
        unique: true,
        nullable: true,
    })
    code: string;

    @Column({
        name: 'name_en',
        type: 'varchar',
        length: '150',
        nullable: false,
    })
    nameEn: string;

    @Column({
        name: 'name_kh',
        type: 'varchar',
        length: '150',
        nullable: false,
    })
    nameKh: string;

    @Column({
        name: 'unit_price',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
        nullable: false,
    })
    unitPrice: number;

    @Column({
        name: 'description',
        type: 'varchar',
        length: '150',
        nullable: true,
    })
    description: string;

    @Column({
        name: 'attachment',
        type: 'varchar',
        nullable: true,
    })
    attachment: string;

    @Column({
        name: 'category_id',
        type: 'integer',
        nullable: true,
    })
    categoryId: number;

    @ManyToOne(() => CategoryEntity, { nullable: true })
    @JoinColumn({
        name: 'category_id'
    })
    category: CategoryEntity;

    @Column({
        name: 'uom_id',
        type: 'integer',
        nullable: true,
    })
    uomId: number;

    @ManyToOne(() => UomEntity, { nullable: true })
    @JoinColumn({
        name: 'uom_id'
    })
    uom: UomEntity;

    @Column({
        name: 'created_by_id',
        type: 'integer',
        nullable: true,
    })
    createdById: number;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({
        name: 'created_by_id'
    })
    createdBy: UserEntity;

    constructor(partial?: Partial<ProductEntity>) {
        super();
        Object.assign(this, partial);
    }
}
