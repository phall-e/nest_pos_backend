import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseRequestRequestDto } from './dto/create-purchase-request-request.dto';
import { UpdatePurchaseRequestRequestDto } from './dto/update-purchase-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseRequestEntity } from './entities/purchase-request.entity';
import { Repository } from 'typeorm';
import { handleError } from '@/utils/handle-error.util';
import { PurchaseRequestResponseDto } from './dto/purchase-request-response.dto';
import { PurchaseRequestMapper } from './purchase-request.mapper';
import { ModuleStatus } from '@/common/enums/status.enum';
import { BasePaginationCrudService } from '@/common/services/base-pagination-crud.service';
import { handleTransactionCodeGeneration } from '@/utils/transaction-code-generation.util';
import { PurchaseRequestItemEntity } from './entities/purchase-request-item.entity';

@Injectable()
export class PurchaseRequestService extends BasePaginationCrudService<PurchaseRequestEntity, PurchaseRequestResponseDto> {
  protected SORTABLE_COLUMNS = ['code', 'requestDate', 'branchId', 'createdById'];
  protected FILTER_COLUMNS = ['code', 'requestDate', 'branch.nameEn', 'branch.nameKh', 'createdBy.username'];
  protected SEARCHABLE_COLUMNS = ['code', 'branch.nameEn', 'branch.nameKh', 'createdBy.username', 'description'];
  protected RELATIONSIP_FIELDS = ['branch', 'createdBy'];

  constructor(
    @InjectRepository(PurchaseRequestEntity)
    private purchaseRequestRepository: Repository<PurchaseRequestEntity>,
    @InjectRepository(PurchaseRequestItemEntity)
    private purchaseRequestItemRepository: Repository<PurchaseRequestItemEntity>,
  ){
    super();
  }

  protected get repository(): Repository<PurchaseRequestEntity> {
    return this.purchaseRequestRepository;
  }

  protected getMapperReponseEntityField(entities: PurchaseRequestEntity): Promise<PurchaseRequestResponseDto> {
    return PurchaseRequestMapper.toDto(entities);
  }

  public async create(dto: CreatePurchaseRequestRequestDto): Promise<PurchaseRequestResponseDto> {
    try {
      let entity = PurchaseRequestMapper.toCreateEntity(dto);
      entity = await this.purchaseRequestRepository.save(entity);
      return PurchaseRequestMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async nextCode(): Promise<string> {
    try {
      const nextCode = await handleTransactionCodeGeneration(this.purchaseRequestRepository, 'PR');
      return nextCode;
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelection(branchId: number): Promise<{ id: number; code: string }[]> {
    try {
      const entities = await this.purchaseRequestRepository.find({
        where: {
          status: ModuleStatus.PROCESSING,
          branchId: branchId,
        },
        select: {
          id: true,
          code: true,
        },
        order: {
          id: 'DESC',
        }
      });
      return entities;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<PurchaseRequestResponseDto> {
    try {
      const entity = await this.purchaseRequestRepository.findOne({
        where: { id },
        relations: {
          branch: true,
          items: {
            product: true,
          }
        }
      });
      if (!entity) throw new NotFoundException();
      return PurchaseRequestMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: number,
    dto: UpdatePurchaseRequestRequestDto,
  ): Promise<PurchaseRequestResponseDto> {
    try {
      let entity = await this.purchaseRequestRepository.findOne({
        where: { id },
        relations: { items: true },
      });

      if (!entity) throw new NotFoundException();

      const existingItemIds = entity.items.map(i => i.id);
      const dtoItemIds = dto.items?.map(i => i.id) ?? [];

      const itemsToRemove = existingItemIds.filter(
        id => !dtoItemIds.includes(id),
      );

      if (itemsToRemove.length > 0) {
        await this.purchaseRequestItemRepository.softDelete(itemsToRemove);
      }

      entity = PurchaseRequestMapper.toUpdateEntity(entity, dto);
      entity = await this.purchaseRequestRepository.save(entity);

      entity = await this.purchaseRequestRepository.findOne({
        where: { id },
        relations: {
          items: true,
        }
      });

      // ✅ SAFE DTO RETURN
      return PurchaseRequestMapper.toDto(entity);

    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<PurchaseRequestResponseDto> {
    try {
      const entity = await this.purchaseRequestRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.purchaseRequestRepository.softDelete(id);
      return PurchaseRequestMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async approve(id: number, userId: number): Promise<PurchaseRequestResponseDto> {
    try {
      const entity = await this.purchaseRequestRepository.findOne({
        where: {
          id: id,
        }
      });
      if (!entity) throw new NotFoundException();
      await this.purchaseRequestRepository.update(
        { id },
        {
          status: ModuleStatus.APPROVED,
          approvedById: userId,
        }
      );
      return PurchaseRequestMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
