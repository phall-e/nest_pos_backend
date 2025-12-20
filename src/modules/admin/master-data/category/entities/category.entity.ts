import { BaseEntity } from "@/database/entities/base.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    schema: 'admin',
    name: 'categories',
})
export class CategoryEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        name: 'id',
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
        name: 'created_by_id',
        type: 'integer',
        nullable: true,
    })
    createdById: number;

    @ManyToOne(()=> UserEntity, { nullable: true })
    @JoinColumn({
        name: 'created_by_id'
    })
    createdBy: UserEntity;

    constructor(partial?: Partial<CategoryEntity>) {
        super();
        Object.assign(this, partial);
    }
}
