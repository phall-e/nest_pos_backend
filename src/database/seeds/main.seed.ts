import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { users } from './user.seed';
import { UserEntity } from '@/modules/admin/system/user/entities/user.entity';
import { PermissionEntity } from '@/modules/admin/system/permission/entities/permission.entity';
import { permissions } from './permission.seed';
import { RoleEntity } from '@/modules/admin/system/role/entities/role.entity';
import { roles } from './role.seed';
import { PasswordHash } from '@/utils/password-hash.util';
import { CategoryEntity } from '@/modules/admin/master-data/category/entities/category.entity';
import { categories } from './category.seed';
import { UomEntity } from '@/modules/admin/master-data/uom/entities/uom.entity';
import { uoms } from './uom.seed';
import { ProductEntity } from '@/modules/admin/master-data/product/entities/product.entity';
import { products } from './product.seed';
import { BranchEntity } from '@/modules/admin/master-data/branch/entities/branch.entity';
import { branches } from './branch.seed';
import { ProductsByBranchesEntity } from '@/modules/admin/master-data/products-by-branches/entities/products-by-branch.entity';
import { productsByBranches } from './products-by-branches.seed';

export default class MainSeeder implements Seeder {
    public async run(database: DataSource): Promise<void> {

        await database.manager.save(PermissionEntity, permissions);
        await database.manager.save(RoleEntity, roles);
        await database.manager.createQueryBuilder()
            .insert()
            .into('admin.role_permissions')
            .values(permissions.map((_, index)=> ({
                role_id: 1,
                permission_id: index + 1,
            })))
            .execute();

        const userHashed: Partial<UserEntity>[] = await Promise.all(
            users.map(async (item) => ({
                ...item,
                password: await PasswordHash.hash(item.password),
            }))
        );

        await database.manager.save(UserEntity, userHashed);

        await database.manager.createQueryBuilder()
            .insert()
            .into('admin.user_roles')
            .values(userHashed.map((_, index)=> ({
                user_id: index + 1,
                role_id: 1,
            })))
            .execute();

        await database.manager.save(CategoryEntity, categories);
        await database.manager.save(UomEntity, uoms);
        await database.manager.save(ProductEntity, products);
        await database.manager.save(BranchEntity, branches);
        await database.manager.save(ProductsByBranchesEntity, productsByBranches);
    }
}