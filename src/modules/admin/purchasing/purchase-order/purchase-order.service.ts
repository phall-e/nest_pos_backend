import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseOrderRequestDto } from './dto/create-purchase-order-request.dto';
import { UpdatePurchaseOrderRequestDto } from './dto/update-purchase-order-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderEntity } from './entities/purchase-order.entity';
import { Repository } from 'typeorm';
import { PurchaseOrderItemEntity } from './entities/purchase-order-item.entity';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { PurchaseOrderResponseDto } from './dto/purchase-order-response.dto';
import { PurchaseOrderMapper } from './purchase-order.mapper';
import { handleError } from '@/utils/handle-error.util';
import { PurchaseRequestEntity } from '../purchase-request/entities/purchase-request.entity';
import { ModuleStatus } from '@/common/enums/status.enum';
import { handleTransactionCodeGeneration } from '@/utils/transaction-code-generation.util';
import { CancelPurchaseOrderRequestDto } from './dto/cancel-purchase-order-request.dto';

@Injectable()
export class PurchaseOrderService extends BasePaginationCrudService<PurchaseOrderEntity, PurchaseOrderResponseDto>{
  protected SORTABLE_COLUMNS = ['code', 'orderDate', 'branchId', 'createdById', 'supplierId'];
  protected FILTER_COLUMNS = ['code', 'orderDate', 'supplier.nameEn', 'supplier.nameKh', 'branch.nameEn', 'branch.nameKh', 'createdBy.username'];
  protected SEARCHABLE_COLUMNS = ['code', 'branch.nameEn', 'branch.nameKh', 'createdBy.username', 'description'];
  protected RELATIONSIP_FIELDS = ['branch', 'purchaseRequest',  'supplier', 'approvedBy', 'createdBy'];

  constructor(
    @InjectRepository(PurchaseOrderEntity)
    private purchaseOrderRepository: Repository<PurchaseOrderEntity>,
    @InjectRepository(PurchaseOrderItemEntity)
    private purchaseOrderItemRepository: Repository<PurchaseOrderItemEntity>,
    @InjectRepository(PurchaseRequestEntity)
    private purchaseRequestRepository: Repository<PurchaseRequestEntity>,
  ){
    super();
  }

  protected get repository(): Repository<PurchaseOrderEntity> {
    return this.purchaseOrderRepository;
  }

  protected getMapperReponseEntityField(entities: PurchaseOrderEntity): Promise<PurchaseOrderResponseDto> {
    return PurchaseOrderMapper.toDto(entities);
  }

  public async create(dto: CreatePurchaseOrderRequestDto): Promise<PurchaseOrderResponseDto> {
    try {
      let entity = PurchaseOrderMapper.toCreateEntity(dto);
      entity = await this.purchaseOrderRepository.save(entity);
      if (entity.purchaseRequestId) {
        await this.purchaseRequestRepository.update(
          {
            id: entity.purchaseRequestId,
          },
          {
            status: ModuleStatus.PROCESSING,
          }
        );
      }

      return PurchaseOrderMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async nextCode(): Promise<string> {
    try {
      const nextCode  = await handleTransactionCodeGeneration(this.purchaseOrderRepository, 'PO');
      return nextCode;
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelection(branchId: number): Promise<{ id: number; code: string}[]> {
    try {
      const entities = await this.purchaseOrderRepository.find({
        where: {
          status: ModuleStatus.APPROVED,
          branchId: branchId,
        },
        order: {
          id: 'DESC',
        },
        select: {
          id: true,
          code: true,
        },
      });
      return entities;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<PurchaseOrderResponseDto> {
    try {
      const entity = await this.purchaseOrderRepository.findOne({
        where: { id },
        relations: {
          purchaseRequest: true,
          branch: true,
          supplier: true,
          items: {
            product: true,
          },
        },
      });
      if (!entity) throw new NotFoundException();
      return PurchaseOrderMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: number, dto: UpdatePurchaseOrderRequestDto): Promise<PurchaseOrderResponseDto> {
    try {
      let entity = await this.purchaseOrderRepository.findOne({
        where: { id },
        relations: {
          items: true,
        },
      });
      if (!entity) throw new NotFoundException();

      const existingItemIds = entity.items.map(i => i.id);
      const dtoItemIds = dto.items?.map(i => i.id) ?? [];

      const itemsToRemove = existingItemIds.filter(
        id => !dtoItemIds.includes(id),
      );

      if (itemsToRemove.length > 0) {
        await this.purchaseOrderItemRepository.softDelete(itemsToRemove);
      }

      entity = PurchaseOrderMapper.toUpdateEntity(entity, dto);
      entity = await this.purchaseOrderRepository.save(entity);

      entity = await this.purchaseOrderRepository.findOne({
        where: { id },
        relations: {
          purchaseRequest: true,
          branch: true,
          supplier: true,
          items: {
            product: true,
          },
        }
      });
      return PurchaseOrderMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<PurchaseOrderResponseDto> {
    try {
      const entity = await this.purchaseOrderRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.purchaseOrderRepository.softDelete(id);
      return PurchaseOrderMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async approve(id: number, userId: number): Promise<PurchaseOrderResponseDto> {
    try {
      let entity = await this.purchaseOrderRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.purchaseOrderRepository.update(
        { id },
        {
          status: ModuleStatus.APPROVED,
          approvedById: userId,
        },
      );
      entity = await this.purchaseOrderRepository.findOneBy({ id });
      return PurchaseOrderMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async cancel(id: number, dto: CancelPurchaseOrderRequestDto): Promise<PurchaseOrderResponseDto> {
    try {
      let entity = await this.purchaseOrderRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.purchaseOrderRepository.update(
        { id },
        {
          status: ModuleStatus.CANCELED,
          reason: dto.reason,
        }
      );
      entity = await this.purchaseOrderRepository.findOneBy({ id });
      return PurchaseOrderMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
