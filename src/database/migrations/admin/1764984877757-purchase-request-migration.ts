import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from "typeorm";
import { commonFields } from "../common.fields";
import { ModuleStatus } from "@/common/enums/status.enum";

const tableName = 'admin.purchase_requests';

export class PurchaseRequestMigration1764984877757 implements MigrationInterface {

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
                        isUnique: true,
                        length: '160',
                        isNullable: false,
                    },
                    {
                        name: 'request_date',
                        type: 'date',
                        isNullable: false,
                    },
                    {
                        name: 'branch_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        length: '160',
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
                    {
                        name: 'approved_by_id',
                        type: 'integer',
                        isNullable: true,
                    }, 
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '30',
                        default: `'${ModuleStatus.PENDING}'`,
                        isNullable: false,
                    },   
                    {
                        name: 'total_quantity',
                        type: 'decimal',
                        precision: 14,
                        scale: 5,
                        default: 0,
                        isNullable: false,
                    },           
                    ...commonFields,
                ],
            }),
            true,
        );

        const foreignKeys = [
            { column: 'branch_id', refTable: 'admin.branches' },
            { column: 'created_by_id', refTable: 'admin.users' },
            { column: 'approved_by_id', refTable: 'admin.users' },
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
