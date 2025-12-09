import { BaseEntity } from "@/database/entities/base.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleEntity } from "../../role/entities/role.entity";

@Entity({
    schema: 'admin',
    name: 'permissions',
})
export class PermissionEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'name',
        type: 'varchar',
        unique: true,
        nullable: false,
    })
    name: string;

    @Column({
        name: 'description',
        type: 'varchar',
        nullable: true,
    })
    description: string;

    @ManyToMany(() => RoleEntity, (role) => role.permissions)
    roles: RoleEntity[];

    constructor(partial?: Partial<PermissionEntity>) {
        super();
        Object.assign(this, partial);
    }
}
