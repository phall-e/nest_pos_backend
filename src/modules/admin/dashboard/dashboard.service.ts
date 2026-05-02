import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleEntity } from '../saling/sale/entities/sale.entity';
import { In, Not, Repository } from 'typeorm';
import { PurchaseReceiptEntity } from '../purchasing/purchase-receipt/entities/purchase-receipt.entity';
import { PurchaseOrderEntity } from '../purchasing/purchase-order/entities/purchase-order.entity';
import { BranchEntity } from '../master-data/branch/entities/branch.entity';
import { UserEntity } from '../system/user/entities/user.entity';
import { SupplierEntity } from '../master-data/supplier/entities/supplier.entity';
import { CustomerEntity } from '../master-data/customer/entities/customer.entity';
import { ModuleStatus } from '@/common/enums/status.enum';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(SaleEntity)
        private saleRepository: Repository<SaleEntity>,
        @InjectRepository(PurchaseReceiptEntity)
        private purchaseReceiptRepository: Repository<PurchaseReceiptEntity>,
        @InjectRepository(PurchaseOrderEntity)
        private purchaseOrderRepository: Repository<PurchaseOrderEntity>,
        @InjectRepository(BranchEntity)
        private branchRepository: Repository<BranchEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(SupplierEntity)
        private supllierRepository: Repository<SupplierEntity>,
        @InjectRepository(CustomerEntity)
        private customerRepository: Repository<CustomerEntity>,
    ){}

    public async getSummaryCounts() {
        const saleEntity = await this.saleRepository.find({
            select: {
                totalAmount: true,
                totalDiscount: true,
                totalPaidAmount: true,
            },
        });

        const totalSaleAmount = saleEntity.reduce((total, item) => total + item.totalAmount, 0);
        const totalSaleDiscountAmount = saleEntity.reduce((total, item) => total + item.totalDiscount, 0);
        const saleGrandTotalAmount = totalSaleAmount - totalSaleDiscountAmount;

        const purchaseReceiptEntity = await this.purchaseReceiptRepository.find({
            select: {
                totalNetAmount: true,
            },
            where: {
                status: Not(ModuleStatus.CANCELED),
            }
        });

        const totalExpense = purchaseReceiptEntity.reduce((total, item) => total + Number(item.totalNetAmount), 0);

        const amountPayToSupplierEntity = await this.purchaseReceiptRepository.find({
            select: {
                totalNetAmount: true,
            },
            where: {
                status: Not(In([ModuleStatus.PAID, ModuleStatus.CANCELED])),
            }
        });

        const totalAmountPayToSupplier = amountPayToSupplierEntity.reduce((total, item) => total + item.totalNetAmount, 0);

        const pendingCustomerPaymentEntity = await this.saleRepository.find({
            select: {
                totalAmount: true,
                totalDiscount: true,
                totalPaidAmount: true,
            },
            where: {
                status: Not(In([ModuleStatus.PAID, ModuleStatus.CANCELED])),
            }
        });

        // const totalAmountPayToSupplier = amountPayToSupplierEntity.reduce((total, item) => total + item.totalNetAmount, 0);

        const totalBranch = await this.branchRepository.count();
        const totalUser = await this.userRepository.count();
        const totalSupplier = await this.supllierRepository.count();
        let totalCustomer = await this.customerRepository.count();
        totalCustomer = totalCustomer - 1;

        return {
            saleGrandTotalAmount,
            totalExpense,
            totalAmountPayToSupplier,
            pendingCustomerPaymentEntity,
            totalBranch,
            totalUser,
            totalSupplier,
            totalCustomer,
        }
    }
}
