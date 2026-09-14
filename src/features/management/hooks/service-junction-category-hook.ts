import type {
    CreateServiceJunctionCategory,
    UpdateServiceJunctionCategory,
} from '../../../models/service-junction-category.model.ts';

import { SERVICE_TABLE } from '../../../utlis/query-keys.ts';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../services/axios.ts';

export function useCreateServiceJunctionCategories(organizationUuid: string, serviceUuid: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateServiceJunctionCategory) => {
            const response = await api.post(
                `/api/organizations/${organizationUuid}/services/${serviceUuid}/categories`,
                data,
            );

            return response.data;
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [SERVICE_TABLE],
            });
        },
    });
}

export function useUpdateServiceJunctionCategories(organizationUuid: string, serviceUuid: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateServiceJunctionCategory) => {
            const response = await api.patch(
                `/api/organizations/${organizationUuid}/services/${serviceUuid}/categories`,
                data,
            );

            return response.data;
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [SERVICE_TABLE],
            });
        },
    });
}