import { BaseEntity } from "@/database/entities/base.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    schema: 'admin',
    name: 'branches',
})
export class BranchEntity extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id'
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
        name: 'manager_name',
        type: 'varchar',
        length: '160',
        nullable: false,
    })
    managerName: string;

    @Column({
        name: 'phone_number',
        type: 'varchar',
        length: '160',
        nullable: true,
    })
    phoneNumber: string;

    @Column({
        name: 'address',
        type: 'varchar',
        length: '160',
        nullable: true,
    })
    address: string;

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

    constructor(partial?: Partial<BranchEntity>) {
        super();
        Object.assign(this, partial);
    }

}
