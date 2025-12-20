import { BadRequestException } from "@nestjs/common";
import { paginate, PaginateConfig, Paginated, PaginateQuery } from "nestjs-paginate";
import { ObjectLiteral, Repository } from "typeorm";
import { PaginatedResponse } from "../paginations/paginated-response.type";

export abstract class BasePaginationCrudService<
    T extends ObjectLiteral,
    K,
> {
    protected abstract repository: Repository<T>;

    protected SORTABLE_COLUMNS: string[] = [];
    protected FILTER_COLUMNS: string[] = [];
    protected SEARCHABLE_COLUMNS: string[] = [];
    protected RELATIONSIP_FIELDS: string[] = [];

    protected abstract getMapperReponseEntityField(entities: T): Promise<K>;

    public async list(query: PaginateQuery): Promise<PaginatedResponse<T, K>> {
        try {
            const result = await paginate(
                query,
                this.repository,
                {
                    sortableColumns: this.SEARCHABLE_COLUMNS as any,
                    searchableColumns: this.SEARCHABLE_COLUMNS as any,
                    defaultLimit: 10,
                    defaultSortBy: [['id', 'DESC']] as PaginateConfig<T>['defaultSortBy'],
                    relations: this.RELATIONSIP_FIELDS as any,
                }
            );
            const mappedData = await Promise.all(
                result.data.map((item) => this.getMapperReponseEntityField(item)),
            );

            return {
                ...result,
                data: mappedData,
            };
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

}