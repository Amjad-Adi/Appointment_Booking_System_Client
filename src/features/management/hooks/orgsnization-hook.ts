import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../services/axios.ts';

import type { QueryResponse } from '../../../models/Query/query.model.ts';
import type {
    CreateOrganizationByAdmin,
    OrganizationResponse,
    QueryOrganization,
    UpdateOrganizationByAdminForm,
    UpdateOrganizationByAdmin,
} from '../../../models/organization.model.ts';

import { ORGANIZATION, ORGANIZATION_TABLE } from '../../../utlis/query-keys.ts';

export function useOrganizations(query: QueryOrganization) {
    return useQuery({
        queryKey: [ORGANIZATION_TABLE, query],
        queryFn: async (): Promise<QueryResponse<OrganizationResponse>> => {
            const response = await api.get<QueryResponse<OrganizationResponse>>(
                '/api/organizations',
                {
                    params: query,
                },
            );
            return response.data;
        },
        placeholderData: keepPreviousData,
    });
}

export function useOrganization(organizationUuid: string) {
    return useQuery({
        queryKey: [ORGANIZATION, organizationUuid],
        queryFn: async (): Promise<OrganizationResponse> => {
            const response = await api.get<OrganizationResponse>(
                `/api/organizations/${organizationUuid}`,
            );
            return response.data;
        },
        enabled: !!organizationUuid,
    });
}

export function useUpdateOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (organization: UpdateOrganizationByAdmin) => {
            const { uuid, ...organizationData } = organization;
            const response = await api.patch(`/api/organizations/${uuid}`, organizationData);
            return response.data;
        },
        onSuccess: async (organization: OrganizationResponse) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [ORGANIZATION_TABLE],
                }),
                queryClient.invalidateQueries({
                    queryKey: [ORGANIZATION, organization.uuid],
                }),
            ]);
        },
        onError: (error) => {
            console.log(error);
        },
    });
}

export function useCreateOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (organization: CreateOrganizationByAdmin) => {
            const response = await api.post('/api/organizations', organization);

            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_TABLE],
            });
        },
        onError: (error) => {
            console.log(error);
        },
    });
}
