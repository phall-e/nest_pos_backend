import { Repository } from "typeorm";
import { SelectQueryBuilder } from "typeorm/browser";
import { PaginationResponseDto } from "../paginations/pagination-response.dto";
import { PaginationRequest } from "../paginations/interfaces/pagination-request.interface";
import { InternalServerErrorException, NotFoundException, RequestTimeoutException } from "@nestjs/common";
import { TimeoutError } from "rxjs";
import { Pagination } from "../paginations/pagination.helper";

export abstract class BaseCrudService {
    protected queryName: string = '';
    protected FILTER_FIELDS: string[] = [];
    protected SEARCH_FIELDS: string[] = []; 

    protected abstract getFilters();

    protected abstract getListQuery();

    protected abstract getMapperResponseEntityField();

    protected getAllFilters() {
        const filters = this.getFilters();

        // Add field specific filter
        if (this.FILTER_FIELDS) {
            this.FILTER_FIELDS.forEach((field) => {
                filters[field] = (query, value) => 
                    query.andWhere(
                        `${
                            field.includes('.') ? '' : this.queryName + '.' 
                        }${field} ILIKE :${field}`,
                        {
                            [field]: `%${value}`,
                        }
                    );
            });
        }

        // Add search logic that applies to multiple fields
        if (this.SEARCH_FIELDS && this.SEARCH_FIELDS.length > 0) {
            filters['search'] = (query, searchValue) => {
                const searchConditions = this.SEARCH_FIELDS.map((field) => 
                    field.includes('.')
                    ? `${field} ILIKE :search`
                    : `${this.queryName}.${field} ILIKE :search`
                ).join(' OR ');

                query.andWhere(`(${searchConditions})`, { search: `%${searchValue}%`});
            };
        } 

        return filters;
    }

    protected applyQueryFilters(query, params) {
        const filters = this.getAllFilters();

        for (const [key, value] of Object.entries(params)) {
            if (value && filters && filters[key]) {
                if (!Array.isArray(filters[key]) && filters[key].length == 0) {
                    filters[key](query, value);
                }
            }
        }
    }

    public async list<T, U>(
        pagination: PaginationRequest,
    ): Promise<PaginationResponseDto<U>> {
        try {
            const [entities, total] = await this.getListAndCount<T>(pagination);
            const dtos: U[] = await Promise.all(
                entities.map(this.getMapperResponseEntityField())
            );
            return Pagination.of<U>(pagination, total, dtos);
        } catch (error) {
            console.log(error);

            if (error instanceof NotFoundException) throw new NotFoundException();

            if (error instanceof TimeoutError) throw new RequestTimeoutException();

            throw new InternalServerErrorException();
        }
    }

    protected getListAndCount<T>(
        pagination: PaginationRequest
    ): Promise<[T[], number]> {
        const { skip, limit: take, order, params } = pagination;
        let query = this.getListQuery() as SelectQueryBuilder<T>;
        this.applyQueryFilters(query, params);

        for (var key in order) {
            query = query.addOrderBy(this.queryName + '.' + key, order[key]);
        }

        return query.skip(skip).take(take).getManyAndCount();
    }
}