import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { commonFields } from "../common.fields";

const tableName = 'admin.branches';

export class BranchMigration1764984877753 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: tableName,
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        isNullable: false,
                    },
                    {
                        name: 'code',
                        type: 'varchar',
                        length: '150',
                        isUnique: true,
                        isNullable: true,
                    },
                    {
                        name: 'name_en',
                        type: 'varchar',
                        length: '150',
                        isNullable: false,
                    },
                    {
                        name: 'name_kh',
                        type: 'varchar',
                        length: '150',
                        isNullable: false,
                    },
                    {
                        name: 'manager_name',
                        type: 'varchar',
                        length: '160',
                        isNullable: false,
                    },
                    {
                        name: 'phone_number',
                        type: 'varchar',
                        length: '160',
                        isNullable: true,
                    },
                    {
                        name: 'address',
                        type: 'varchar',
                        length: '160',
                        isNullable: true,
                    },
                    {
                        name: 'created_by_id',
                        type: 'integer',
                        isNullable: true,
                    },                   
                    ...commonFields,
                ],
            }),
            true,
        );

        const foreignKeys = [
            { column: 'created_by_id', refTable: 'admin.users' },
        ];  

        for (const fk of foreignKeys) {
            await queryRunner.createForeignKey(
                tableName,
                new TableForeignKey({
                    columnNames: [fk.column],
                    referencedColumnNames: ['id'],
                    referencedTableName: fk.refTable,
                    onDelete: 'SET NULL'
                })
            )
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable(tableName);
        if (table) {
            for (const fk of table.foreignKeys) {
                await queryRunner.dropForeignKey(tableName, fk);
            }
            await queryRunner.dropTable(tableName);
        }
    }

}
