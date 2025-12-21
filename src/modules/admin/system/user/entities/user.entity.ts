import { BaseEntity } from "@/database/entities/base.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleEntity } from "../../role/entities/role.entity";
import { BranchEntity } from "@/modules/admin/master-data/branch/entities/branch.entity";

@Entity({
    schema: 'admin',
    name: 'users',
})
export class UserEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'username',
        type: 'varchar',
        unique: true,
        nullable: false,
        length: '160',
    })
    username: string;

    @Column({
        name: 'password',
        type: 'varchar',
        nullable: false,
    })
    password: string;

    @Column({
        name: 'is_admin',
        type: 'boolean',
        nullable: true,
    })
    isAdmin: boolean;

    @Column({
        name: 'is_active',
        type: 'boolean',
        default: true,
        nullable: true,
    })
    isActive: boolean;

    @ManyToMany(() => RoleEntity, (role) => role.users, { cascade: true })
    @JoinTable({
        name: 'user_roles',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        }
    })
    roles: Promise<RoleEntity[]>;

    @ManyToMany(() => BranchEntity, (branch) => branch.users, {
        lazy: true,
        cascade: true,
    })
    @JoinTable({
        schema: 'admin',
        name: 'users_branches',
        joinColumn: { name: 'user_id' },
        inverseJoinColumn: { name: 'branch_id' },
    })
    branches: BranchEntity[];

    constructor(partial?: Partial<UserEntity>) {
        super();
        Object.assign(this, partial);
    }

}
