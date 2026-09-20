import type {
    QueryServiceCategory,
    ServiceCategoryResponse,
} from '../../../models/service-category.model.ts';
import type { QueryResponse } from '../../../models/Query/query.model.ts';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { api } from '../../../services/axios.ts';
import { SERVICE_CATEGORY_TABLE } from '../../../utlis/query-keys.ts';

export function useServiceCategories(query: QueryServiceCategory) {
    return useQuery({
        queryKey: [SERVICE_CATEGORY_TABLE, query],
        queryFn: async (): Promise<QueryResponse<ServiceCategoryResponse>> => {
            const response = await api.get<QueryResponse<ServiceCategoryResponse>>(
                '/api/services/categories',
                {
                    params: query,
                },
            );
            return response.data;
        },
        placeholderData: keepPreviousData,
    });
}
