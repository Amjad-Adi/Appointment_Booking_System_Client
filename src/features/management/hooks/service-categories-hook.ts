import type {
    CreateServiceCategory,
    QueryServiceCategory,
    ServiceCategoryResponse,
    UpdateServiceCategory,
} from '../../../models/service-category.model.ts';
import type { QueryResponse } from '../../../models/Query/query.model.ts';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../services/axios.ts';
import { SERVICE_CATEGORY_TABLE } from '../../../utlis/query-keys.ts';
import { toFormData } from '../../../utlis/form-data.ts';
import { useDebouncedQuery } from '../../../hooks/deounce.ts';

export function useServiceCategories(query: QueryServiceCategory) {
    const debouncedQuery = useDebouncedQuery(query);

    return useQuery({
        queryKey: [SERVICE_CATEGORY_TABLE, debouncedQuery],
        queryFn: async (): Promise<QueryResponse<ServiceCategoryResponse>> => {
            const response = await api.get<QueryResponse<ServiceCategoryResponse>>(
                '/api/services/categories',
                {
                    params: debouncedQuery,
                },
            );
            return response.data;
        },
        placeholderData: keepPreviousData,
    });
}

export function useCreateServiceCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            category: CreateServiceCategory & { picture?: File | null },
        ): Promise<ServiceCategoryResponse> => {
            const { picture, ...categoryData } = category;
            const formData = toFormData(categoryData);

            if (picture) {
                formData.append('picturePath', picture);
            }

            const response = await api.post<ServiceCategoryResponse>(
                '/api/services/categories',
                formData,
            );
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [SERVICE_CATEGORY_TABLE] });
        },
    });
}

export function useUpdateServiceCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            uuid,
            picture,
            ...category
        }: UpdateServiceCategory & { picture?: File | null }): Promise<ServiceCategoryResponse> => {
            const formData = toFormData(category);

            if (picture) {
                formData.append('picturePath', picture);
            }

            const response = await api.patch<ServiceCategoryResponse>(
                `/api/services/categories/${uuid}`,
                formData,
            );
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [SERVICE_CATEGORY_TABLE] });
        },
    });
}
