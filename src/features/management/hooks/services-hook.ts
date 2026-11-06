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
import { toFormData } from '../../../utlis/form-data.ts';
import { useDebouncedQuery } from '../../../hooks/deounce.ts';

export function useServices(query: QueryService, enabled = true) {
    const debouncedQuery = useDebouncedQuery(query);

    return useQuery({
        queryKey: [SERVICE_TABLE, debouncedQuery],
        queryFn: async (): Promise<QueryResponse<ServiceResponse>> => {
            const response = await api.get<QueryResponse<ServiceResponse>>('/api/services', {
                params: debouncedQuery,
            });

            return response.data;
        },
        enabled,
        placeholderData: keepPreviousData,
    });
}

export function useService(serviceUuid: string, enabled = true) {
    return useQuery({
        queryKey: [SERVICE, serviceUuid],
        queryFn: async (): Promise<ServiceResponse> => {
            const response = await api.get<ServiceResponse>(`/api/services/${serviceUuid}`);

            return response.data;
        },
        enabled: enabled && !!serviceUuid,
    });
}

export function useOrganizationServices(
    organizationUuid: string | undefined,
    query: QueryService,
    enabled = true,
) {
    const debouncedQuery = useDebouncedQuery(query);

    return useQuery({
        queryKey: [ORGANIZATION_SERVICE_TABLE, organizationUuid, debouncedQuery],
        queryFn: async (): Promise<QueryResponse<ServiceResponse>> => {
            const response = await api.get<QueryResponse<ServiceResponse>>(
                `/api/organizations/${organizationUuid}/services`,
                {
                    params: debouncedQuery,
                },
            );

            return response.data;
        },
        enabled: enabled && !!organizationUuid,
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
        mutationFn: async (
            service: Omit<CreateService, 'organizationUuid'> & {
                picture?: File | null;
            },
        ): Promise<ServiceResponse> => {
            const { picture, ...serviceData } = service;
            const formData = toFormData(serviceData);

            if (picture) {
                formData.append('servicePicturePath', picture);
            }

            const response = await api.post<ServiceResponse>(
                `/api/organizations/${organizationUuid}/services`,
                formData,
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
            picture,
            ...service
        }: Omit<UpdateService, 'organizationUuid' | 'userUuid'> & {
            uuid: string;
            picture?: File | null;
        }): Promise<ServiceResponse> => {
            const formData = toFormData(service);

            if (picture) {
                formData.append('servicePicturePath', picture);
            }

            const response = await api.patch<ServiceResponse>(
                `/api/organizations/${organizationUuid}/services/${uuid}`,
                formData,
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
