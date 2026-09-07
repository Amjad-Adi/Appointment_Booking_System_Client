import { z } from 'zod';
import { Order } from '../enums/order.ts';

export interface Filter {}
export interface DataResponses {}
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;

export interface Query {
    search?: string;
    filter?: Filter;
    sortBy?: string;
    order?: Order;
    offset?: number;
    limit?: number;
}

// FIX: Added generic `<T = DataResponses>` for reusable array typings
export class QueryResponse<T = DataResponses> {
    data: T[];
    pagination: Pagination;
    links: Links;
    constructor(
        data: T[],
        totalNumberOfItems: number,
        baseUrl: string,
        page?: number,
        limit?: number,
    ) {
        if (limit === undefined) {
            limit = DEFAULT_LIMIT;
        }
        if (page === undefined) {
            page = DEFAULT_PAGE;
        }
        this.data = data;
        this.pagination = {
            totalItems: totalNumberOfItems,
            totalPages: Math.ceil(totalNumberOfItems / limit),
            currentPage: page,
        };
        this.links = {
            self: `${baseUrl}?page=${page}&limit=${limit}`,
            first: `${baseUrl}?page=${1}&limit=${limit}`,
            prev: page == 1 ? null : `${baseUrl}?page=${page - 1}&limit=${limit}`,
            next:
                page >= this.pagination.totalItems
                    ? null
                    : `${baseUrl}?page=${page + 1}&limit=${limit}`,
            last: `${baseUrl}?page=${this.pagination.totalPages}&limit=${limit}`,
        };
    }
}

export interface Pagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

export interface Links {
    self: string;
    first: string;
    prev: string | null;
    next: string | null;
    last: string;
}
