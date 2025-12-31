import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from "typeorm";
import { commonFields } from "../common.fields";

const tableName = 'admin.purchase_receipt_items';

export class PurchaseReceiptItemMigration1764984877762 implements MigrationInterface {

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
                        name: 'purchase_receipt_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'product_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'quantity',
                        type: 'decimal',
                        precision: 14,
                        scale: 2,
                        default: 0,
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
                        name: 'discount',
                        type: 'decimal',
                        precision: 14,
                        scale: 5,
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: 'note',
                        type: 'varchar',
                        length: '160',
                        isNullable: true,
                    },          
                    ...commonFields,
                ],
            }),
            true,
        );

        const foreignKeys = [
            { column: 'purchase_receipt_id', refTable: 'admin.purchase_receipts' },
            { column: 'product_id', refTable: 'admin.products' },
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
