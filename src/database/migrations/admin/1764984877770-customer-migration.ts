import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from "typeorm";
import { commonFields } from "../common.fields";

const tableName = 'admin.customers';

export class CustomerMigration1764984877770 implements MigrationInterface {

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
                        name: 'customer_type_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'code',
                        type: 'varchar',
                        isUnique: true,
                        length: '160',
                        isNullable: false,
                    },
                    {
                        name: 'name_en',
                        type: 'varchar',
                        length: '160',
                        isNullable: false,
                    },
                    {
                        name: 'name_kh',
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
                        name: 'note',
                        type: 'varchar',
                        length: '160',
                        isNullable: true,
                    },
                    {
                        name: 'profile',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'attachments',
                        type: 'jsonb',
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
            { column: 'customer_type_id', refTable: 'admin.customer_typies' },
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
