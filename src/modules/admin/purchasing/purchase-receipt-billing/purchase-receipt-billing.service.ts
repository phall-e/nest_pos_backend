import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseReceiptBillingRequestDto } from './dto/create-purchase-receipt-billing-request.dto';
import { UpdatePurchaseReceiptBillingRequestDto } from './dto/update-purchase-receipt-billing-request.dto';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { PurchaseReceiptBillingEntity } from './entities/purchase-receipt-billing.entity';
import { PurchaseReceiptBillingResponseDto } from './dto/purchase-receipt-billing-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { handleError } from '@/utils/handle-error.util';
import { handleTransactionCodeGeneration } from '@/utils/transaction-code-generation.util';
import { PurchaseReceiptBillingMapper } from './purchase-receipt-billing.mapper';
import { ModuleStatus } from '@/common/enums/status.enum';
import { PurchaseReceiptEntity } from '../purchase-receipt/entities/purchase-receipt.entity';

@Injectable()
export class PurchaseReceiptBillingService extends BasePaginationCrudService<PurchaseReceiptBillingEntity, PurchaseReceiptBillingResponseDto>{
  protected SORTABLE_COLUMNS = ['code', 'purchaseReceipt.code', 'purchaseReceipt.supplier.nameEn', 'purchaseReceipt.supplier.nameKh'];
  protected FILTER_COLUMNS = ['code', 'billingDate'];
  protected SEARCHABLE_COLUMNS = ['code', 'purchaseReceipt.code', 'purchaseReceipt.supplier.nameEn', 'purchaseReceipt.supplier.nameKh', 'note'];
  protected RELATIONSIP_FIELDS = ['purchaseReceipt.branch',  'purchaseReceipt.supplier', 'billingBy', 'createdBy'];

  constructor(
    @InjectRepository(PurchaseReceiptBillingEntity)
    private purchaseReceiptBillingRepository: Repository<PurchaseReceiptBillingEntity>,
    @InjectRepository(PurchaseReceiptEntity)
    private purchaseReceiptRepository: Repository<PurchaseReceiptEntity>,
    private dataSource: DataSource,
  ){
    super();
  }

  protected get repository(): Repository<PurchaseReceiptBillingEntity> {
    return this.purchaseReceiptBillingRepository;
  }

  protected getMapperReponseEntityField(entities: PurchaseReceiptBillingEntity): Promise<PurchaseReceiptBillingResponseDto> {
    return PurchaseReceiptBillingMapper.toDto(entities);
  }

  public async create(dto: CreatePurchaseReceiptBillingRequestDto): Promise<PurchaseReceiptBillingResponseDto> {

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let entity = PurchaseReceiptBillingMapper.toCreateEntity(dto);
      entity = await this.purchaseReceiptBillingRepository.save(entity);
      
      const purchaseReceipt = await this.purchaseReceiptRepository.findOne({
        where: { id: entity.purchaseReceiptId },
      });

      if (purchaseReceipt) {

        await this.purchaseReceiptRepository.increment({ id: purchaseReceipt.id }, 'totalPaidAmount', entity.amount);
        const paidAmount = Number(entity.amount) + Number(purchaseReceipt.totalPaidAmount);

        if (Number(purchaseReceipt.totalNetAmount) === paidAmount) {
          await this.purchaseReceiptRepository.update(
            { id: purchaseReceipt.id },
            { status: ModuleStatus.PAID },
          );
        }

      }
      await queryRunner.commitTransaction();

      return PurchaseReceiptBillingMapper.toDto(entity);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleError(error); 
    } finally {
      await queryRunner.release();
    }
  }

  public async nextCode(): Promise<string> {
    try {
      const nextCode  = await handleTransactionCodeGeneration(this.purchaseReceiptBillingRepository, 'PRB');
      return nextCode;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<PurchaseReceiptBillingResponseDto> {
    try {
      const entity = await this.purchaseReceiptBillingRepository.findOne({
        where: { id },
        relations: {
          createdBy: true,
          billingBy: true,
          purchaseReceipt: {
            branch: true,
            supplier: true,
            createdBy: true,
          },
        }
      });
      if (!entity) throw new NotFoundException();
      return PurchaseReceiptBillingMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: number, dto: UpdatePurchaseReceiptBillingRequestDto): Promise<PurchaseReceiptBillingResponseDto> {

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let entity = await this.purchaseReceiptBillingRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();

      entity = PurchaseReceiptBillingMapper.toUpdateEntity(entity, dto);
      entity = await this.purchaseReceiptBillingRepository.save(entity);

      await queryRunner.commitTransaction();

      return PurchaseReceiptBillingMapper.toDto(entity);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleError(error);
    } finally {
      await queryRunner.release();
    }

  }

  public async remove(id: number): Promise<PurchaseReceiptBillingResponseDto> {
    try {
      const entity = await this.purchaseReceiptBillingRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.purchaseReceiptBillingRepository.softDelete(id);
      return PurchaseReceiptBillingMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
