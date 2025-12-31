import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseReceiptRequestDto } from './dto/create-purchase-receipt-resquest.dto';
import { UpdatePurchaseReceiptRequestDto } from './dto/update-purchase-receipt-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseReceiptEntity } from './entities/purchase-receipt.entity';
import { Repository } from 'typeorm';
import { PurchaseReceiptItemEntity } from './entities/purchase-receipt-item.entity';
import { PurchaseOrderEntity } from '../purchase-order/entities/purchase-order.entity';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { PurchaseReceiptResponseDto } from './dto/purchase-receipt-response.dto';
import { PurchaseReceiptMapper } from './purchase-receipt.mapper';
import { handleError } from '@/utils/handle-error.util';
import { ModuleStatus } from '@/common/enums/status.enum';
import { handleTransactionCodeGeneration } from '@/utils/transaction-code-generation.util';
import { CancelPurchaseReceiptRequestDto } from './dto/cancel-purchase-receipt-request.dto';

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
      if (entity.purchaseOrderId) {
        await this.purchaseOrderRepository.update(
          { id: entity.id },
          {
            status: ModuleStatus.PROCESSING,
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

  public async findAllForSelection(branchId: number): Promise<{id: number; code: string }[]> {
    try {
      const entities = await this.purchaseReceiptRepository.find({
        where: {
          branchId: branchId,
          status: ModuleStatus.APPROVED,
        },
        select: {
          id: true,
          code: true,
        }
      });
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
          purchaseOrder: true,
          branch: true,
          supplier: true,
          approvedBy: true,
          createdBy: true,
          items: {
            product: true,
          }
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
