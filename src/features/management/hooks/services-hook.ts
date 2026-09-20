import type {
    CreateService,
    QueryService,
    ServiceResponse,
    UpdateService,
} from '../../../models/service.model.ts';

import {
    SERVICE,
    SERVICE_TABLE,
    ORGANIZATION_SERVICE,
    ORGANIZATION_SERVICE_TABLE,
} from '../../../utlis/query-keys.ts';

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

export function useService(serviceUuid: string) {
    return useQuery({
        queryKey: [SERVICE, serviceUuid],
        queryFn: async (): Promise<ServiceResponse> => {
            const response = await api.get<ServiceResponse>(`/api/services/${serviceUuid}`);

            return response.data;
        },
        enabled: !!serviceUuid,
    });
}

export function useOrganizationServices(organizationUuid: string | undefined, query: QueryService) {
    return useQuery({
        queryKey: [ORGANIZATION_SERVICE_TABLE, organizationUuid, query],
        queryFn: async (): Promise<QueryResponse<ServiceResponse>> => {
            const response = await api.get<QueryResponse<ServiceResponse>>(
                `/api/organizations/${organizationUuid}/services`,
                {
                    params: query,
                },
            );

            return response.data;
        },
        enabled: !!organizationUuid,
        placeholderData: keepPreviousData,
    });
}

export function useOrganizationService(
    organizationUuid: string | undefined,
    serviceUuid: string | undefined,
) {
    return useQuery({
        queryKey: [ORGANIZATION_SERVICE, organizationUuid, serviceUuid],
        queryFn: async (): Promise<ServiceResponse> => {
            const response = await api.get<ServiceResponse>(
                `/api/organizations/${organizationUuid}/services/${serviceUuid}`,
            );

            return response.data;
        },
        enabled: !!organizationUuid && !!serviceUuid,
    });
}

export function useCreateOrganizationService(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (service: CreateService): Promise<ServiceResponse> => {
            const response = await api.post<ServiceResponse>(
                `/api/organizations/${organizationUuid}/services`,
                service,
            );

            return response.data;
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_SERVICE_TABLE, organizationUuid],
            });
        },
    });
}
export function useUpdateOrganizationService(organizationUuid: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            uuid,
            ...service
        }: UpdateService & {
            uuid: string;
        }): Promise<ServiceResponse> => {
            const response = await api.patch<ServiceResponse>(
                `/api/organizations/${organizationUuid}/services/${uuid}`,
                service,
            );

            return response.data;
        },

        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_SERVICE_TABLE, organizationUuid],
            });

            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_SERVICE, organizationUuid, variables.uuid],
            });
        },
    });
}
