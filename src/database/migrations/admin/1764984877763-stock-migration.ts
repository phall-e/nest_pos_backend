import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from "typeorm";
import { commonFields } from "../common.fields";

const tableName = 'admin.stocks';

export class StockMigration1764984877763 implements MigrationInterface {

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
                        name: 'branch_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'product_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'min_stock',
                        type: 'decimal',
                        precision: 14,
                        scale: 5,
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: 'stock_in',
                        type: 'decimal',
                        precision: 14,
                        scale: 5,
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: 'stock_adjustment',
                        type: 'decimal',
                        precision: 14,
                        scale: 5,
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: 'stock_transfer',
                        type: 'decimal',
                        precision: 14,
                        scale: 5,
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: 'stock_out',
                        type: 'decimal',
                        precision: 14,
                        scale: 5,
                        default: 0,
                        isNullable: false,
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
            { column: 'product_id', refTable: 'admin.products' },
            { column: 'branch_id', refTable: 'admin.branches' },
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

        await queryRunner.createUniqueConstraint(
            tableName,
            new TableUnique({
                name: 'UQ_stocks_product_branch',
                columnNames: ['branch_id', 'product_id',],
            }),
        );
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
