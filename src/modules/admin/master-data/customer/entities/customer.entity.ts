import { BaseEntity } from "@/database/entities/base.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CustomerTypeEntity } from "../../customer-type/entities/customer-type.entity";
import { CustomerAttachment } from "../dto/attachement.dto";

@Entity({
    schema: 'admin',
    name: 'customers'
})
export class CustomerEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'customer_type_id',
        type: 'integer',
        nullable: false,
    })
    customerTypeId: number;

    @ManyToOne(() => CustomerTypeEntity, { nullable: true })
    @JoinColumn({
        name: 'customer_type_id',
    })
    customerType: CustomerTypeEntity;

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
        name: 'profile',
        type: 'varchar',
        nullable: true,
    })
    profile: string;
    
    @Column({
        name: 'attachments',
        type: 'jsonb',
        nullable: true,
    })
    attachments: CustomerAttachment[];

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

    constructor(partial?: Partial<CustomerEntity>) {
        super();
        Object.assign(this, partial);
    }
}
