import type {
    CreateServiceJunctionCategory,
    UpdateServiceJunctionCategory,
} from '../../../models/service-junction-category.model.ts';

import { SERVICE_TABLE, SERVICE } from '../../../utlis/query-keys.ts';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../services/axios.ts';

async function createServiceJunctionCategories(
    organizationUuid: string,
    serviceUuid: string,
    serviceCategoryUuids: string[],
) {
    const data: CreateServiceJunctionCategory = {
        serviceUuid,
        serviceCategoryUuids,
    };

    const response = await api.post(
        `/api/organizations/${organizationUuid}/services/${serviceUuid}/categories`,
        data,
    );

    return response.data;
}

export function useCreateServiceJunctionCategories(organizationUuid?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            serviceUuid,
            serviceCategoryUuids,
        }: {
            serviceUuid: string;
            serviceCategoryUuids: string[];
        }) => {
            if (!organizationUuid) {
                throw new Error('Organization UUID is required');
            }

            return createServiceJunctionCategories(
                organizationUuid,
                serviceUuid,
                serviceCategoryUuids,
            );
        },

        onSuccess: async (_data, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [SERVICE_TABLE],
                }),

                queryClient.invalidateQueries({
                    queryKey: [SERVICE, variables.serviceUuid],
                }),
            ]);
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
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [SERVICE_TABLE],
                }),

                queryClient.invalidateQueries({
                    queryKey: [SERVICE, serviceUuid],
                }),
            ]);
        },
    });
}
