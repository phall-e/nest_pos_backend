import { MigrationInterface, QueryRunner, Table } from "typeorm";

const tableName = 'admin.users_branches',
    usersTable = 'admin.users',
    branchesTable = 'admin.branches';

export class UserBranchMigration1764984877754 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: tableName,
                columns: [
                    {
                        name: 'user_id',
                        type: 'integer',
                        isPrimary: true,
                        isNullable: false,
                    },
                    {
                        name: 'branch_id',
                        type: 'integer',
                        isPrimary: true,
                        isNullable: false,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['user_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: usersTable,
                        onUpdate: 'CASCADE',
                    },
                    {
                        columnNames: ['branch_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: branchesTable,
                        onUpdate: 'CASCADE',
                    }
                ]
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(tableName, true, true);
    }

}
