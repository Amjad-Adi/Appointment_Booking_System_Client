import type {
    CreateService,
    QueryService,
    ServiceResponse,
    UpdateService,
} from '../../../models/service.model.ts';

import { SERVICE_TABLE } from '../../../utlis/query-keys.ts';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { QueryResponse } from '../../../models/Query/query.model.ts';
import { api } from '../../../services/axios.ts';

export function useServices(query: QueryService) {
    return useQuery({
        queryKey: [SERVICE_TABLE, query],
        queryFn: async (): Promise<QueryResponse<ServiceResponse>> => {
            const response = await api.get<QueryResponse<ServiceResponse>>('/api/services', {
                params: query,
            });

            return response.data;
        },
        placeholderData: keepPreviousData,
    });
}

export function useCreateOrganizationService(organizationUuid: string|undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (service: CreateService) => {
            const response = await api.post<ServiceResponse>(
                `/api/organizations/${organizationUuid}/services`,
                service,
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

export function useUpdateOrganizationService(organizationUuid: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ uuid, ...service }: UpdateService & { uuid: string }) => {
            const response = await api.patch<ServiceResponse>(
                `/api/organizations/${organizationUuid}/services/${uuid}`,
                service,
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
