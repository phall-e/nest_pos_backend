import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { commonFields } from "../common.fields";

const tableName = 'admin.products';

export class ProductMigration1764984877751 implements MigrationInterface {

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
                        name: 'unit_price',
                        type: 'decimal',
                        precision: 14,
                        scale: 5,
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: 'category_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'uom_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'created_by_id',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        length: '150',
                        isNullable: true,
                    },
                    {
                        name: 'attachment',
                        type: 'varchar',
                        isNullable: true,
                    },
                   
                    ...commonFields,
                ],
            }),
            true,
        );

        const foreignKeys = [
            { column: 'category_id', refTable: 'admin.categories' },
            { column: 'uom_id', refTable: 'admin.uoms' },
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
