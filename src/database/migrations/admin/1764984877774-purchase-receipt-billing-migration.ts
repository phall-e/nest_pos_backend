import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { commonFields } from "../common.fields";

const tableName = 'admin.purchase_receipt_billings';

export class PurchaseReceiptBillingMigration1764984877774 implements MigrationInterface {

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
                        isNullable: false,
                        length: '160',
                    },
                    {
                        name: 'purchase_receipt_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'created_by_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'billing_by_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'billing_date',
                        type: 'date',
                        isNullable: false,
                    },
                    {
                        name: 'amount',
                        type: 'decimal',
                        precision: 14,
                        scale: 5,
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: 'attachments',
                        type: 'jsonb',
                        isNullable: true,
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
            { column: 'billing_by_id', refTable: 'admin.users' },
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
