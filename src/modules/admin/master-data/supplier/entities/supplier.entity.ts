import { BaseEntity } from "@/database/entities/base.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    schema: 'admin',
    name: 'supplier'
})
export class SupplierEntity extends BaseEntity{
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
        name: 'name_en',
        type: 'varchar',
        length: '160',
        nullable: false,
    })
    nameEn: string;

    @Column({
        name: 'name_kh',
        type: 'varchar',
        length: '160',
        nullable: false,
    })
    nameKh: string;

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
        name: 'note',
        type: 'varchar',
        length: '160',
        nullable: true,
    })
    note: string;

    @Column({
        name: 'attachment',
        type: 'varchar',
        nullable: true,
    })
    attachment: string;

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

    constructor(partial?: Partial<SupplierEntity>) {
        super();
        Object.assign(this, partial);
    }
}
