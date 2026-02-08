import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseReceiptRequestDto } from './dto/create-purchase-receipt-resquest.dto';
import { UpdatePurchaseReceiptRequestDto } from './dto/update-purchase-receipt-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseReceiptEntity } from './entities/purchase-receipt.entity';
import { In, Not, Repository } from 'typeorm';
import { PurchaseReceiptItemEntity } from './entities/purchase-receipt-item.entity';
import { PurchaseOrderEntity } from '../purchase-order/entities/purchase-order.entity';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { PurchaseReceiptResponseDto } from './dto/purchase-receipt-response.dto';
import { PurchaseReceiptMapper } from './purchase-receipt.mapper';
import { handleError } from '@/utils/handle-error.util';
import { ModuleStatus } from '@/common/enums/status.enum';
import { handleTransactionCodeGeneration } from '@/utils/transaction-code-generation.util';
import { CancelPurchaseReceiptRequestDto } from './dto/cancel-purchase-receipt-request.dto';
import { PurchaseReceiptBillingService } from '../purchase-receipt-billing/purchase-receipt-billing.service';

@Injectable()
export class PurchaseReceiptService extends BasePaginationCrudService<PurchaseReceiptEntity, PurchaseReceiptResponseDto>{
  protected SORTABLE_COLUMNS = ['code', 'receiptDate', 'branchId', 'createdById', 'supplierId'];
  protected FILTER_COLUMNS = ['code', 'receiptDate', 'supplier.nameEn', 'supplier.nameKh', 'branch.nameEn', 'branch.nameKh', 'createdBy.username'];
  protected SEARCHABLE_COLUMNS = ['code', 'branch.nameEn', 'branch.nameKh', 'createdBy.username', 'description'];
  protected RELATIONSIP_FIELDS = ['branch', 'purchaseOrder',  'supplier', 'approvedBy', 'createdBy'];

  constructor(
    @InjectRepository(PurchaseReceiptEntity)
    private purchaseReceiptRepository: Repository<PurchaseReceiptEntity>,
    @InjectRepository(PurchaseReceiptItemEntity)
    private purchaseReceiptItemRepository: Repository<PurchaseReceiptItemEntity>,
    @InjectRepository(PurchaseOrderEntity)
    private purchaseOrderRepository: Repository<PurchaseOrderEntity>,
    private purchaseReceiptBillingService: PurchaseReceiptBillingService,
  ){
    super();
  }

  protected get repository(): Repository<PurchaseReceiptEntity> {
    return this.purchaseReceiptRepository;
  }

  protected getMapperReponseEntityField(entities: PurchaseReceiptEntity): Promise<PurchaseReceiptResponseDto> {
    return PurchaseReceiptMapper.toDto(entities);
  }

  public async create(dto: CreatePurchaseReceiptRequestDto): Promise<PurchaseReceiptResponseDto> {
    try {
      let entity = PurchaseReceiptMapper.toCreateEntity(dto);
      entity = await this.purchaseReceiptRepository.save(entity);

      if (dto.isPayNow) {
        const billingNumber = await this.purchaseReceiptBillingService.nextCode();
        await this.purchaseReceiptBillingService.create({
          code: billingNumber,
          purchaseReceiptId: entity.id,
          billingById: entity.createdById,
          billingDate: new Date(),
          amount: Number(dto.totalNetAmount),
          createdById: entity.createdById,
          note: '',
          attachments: [],
        });
      }
      if (entity.purchaseOrderId) {
        await this.purchaseOrderRepository.update(
          { id: entity.id },
          {
            status: ModuleStatus.COMPLETED,
          }
        );
      }
      return PurchaseReceiptMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async nextCode(): Promise<string> {
    try {
      const nextCode = await handleTransactionCodeGeneration(this.purchaseReceiptRepository, 'PRC');
      return nextCode;
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForBillingSelection(
    branchId: number,
    isPaid: boolean,
  ): Promise<{id: number; code: string; createdById: number }[]> {
    try {
      const where: any = {
        branchId,
      }

      // ✅ Apply condition only when is paid = false
      if (isPaid == false) {
        where.status = Not(In([ModuleStatus.PAID, ModuleStatus.CANCELED]));
      }

      const entities = await this.purchaseReceiptRepository.find({
        where,
        select: {
          id: true,
          code: true,
          createdById: true,
        },
        order: {
          id: 'DESC',
        },
      })
      return entities;
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForStockSelection(
    branchId: number,
    isStock: boolean,
  ): Promise<{id: number; code: string; createdById: number }[]> {
    try {
      const where: any = {
        branchId,
      }

      // ✅ Apply condition only when isApproved = true
      if (isStock) {
        where.isInStock = false;
        where.status = Not(ModuleStatus.CANCELED);
      }

      const entities = await this.purchaseReceiptRepository.find({
        where,
        select: {
          id: true,
          code: true,
          createdById: true,
        },
        order: {
          id: 'DESC',
        },
      })
      return entities;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<PurchaseReceiptResponseDto> {
    try {
      const entity = await this.purchaseReceiptRepository.findOne({
        where: { id },
        relations: {
          purchaseOrder: {
            createdBy: true,
          },
          branch: true,
          supplier: true,
          approvedBy: true,
          createdBy: true,
          items: {
            product: {
              category: true,
              uom: true,
            },
          },
          purchaseReceiptBillings: {
            billingBy: true,
          },
        }
      });
      if (!entity) throw new NotFoundException();
      return PurchaseReceiptMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: number, dto: UpdatePurchaseReceiptRequestDto): Promise<PurchaseReceiptResponseDto> {
    try { 
      let entity = await this.purchaseReceiptRepository.findOne({
        where: { id },
        relations: {
          items: true,
        }
      });
      if (!entity) throw new NotFoundException();
      
      const existingItemIds = entity.items.map(i => i.id);
      const dtoItemIds = dto.items?.map(i => i.id) ?? [];

      const itemsToRemove = existingItemIds.filter(
        id => !dtoItemIds.includes(id),
      );

      if (itemsToRemove.length > 0) {
        await this.purchaseReceiptItemRepository.softDelete(itemsToRemove);
      }

      entity = PurchaseReceiptMapper.toUpdateEntity(entity, dto);
      entity = await this.purchaseReceiptRepository.save(entity);

      entity = await this.purchaseReceiptRepository.findOne({
        where: { id },
        relations: {
          purchaseOrder: true,
          branch: true,
          supplier: true,
          approvedBy: true,
          createdBy: true,
          items: {
            product: true,
          },
        },
      });

      return PurchaseReceiptMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<PurchaseReceiptResponseDto> {
    try {
      const entity = await this.purchaseReceiptRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.purchaseReceiptRepository.softDelete(id);
      return PurchaseReceiptMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async approve(id: number, userId: number): Promise<PurchaseReceiptResponseDto> {
    try {
      let entity = await this.purchaseReceiptRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.purchaseReceiptRepository.update(
        { id },
        {
          status: ModuleStatus.APPROVED,
          approveedById: userId,
        }
      );
      entity = await this.purchaseReceiptRepository.findOneBy({ id });
      return PurchaseReceiptMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async cancel(id: number, dto: CancelPurchaseReceiptRequestDto): Promise<PurchaseReceiptResponseDto> {
    try {
      let entity = await this.purchaseReceiptRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.purchaseReceiptRepository.update(
        { id },
        {
          status: ModuleStatus.CANCELED,
          reason: dto.reason,
        },
      );
      entity = await this.purchaseReceiptRepository.findOneBy({ id });
      return PurchaseReceiptMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
