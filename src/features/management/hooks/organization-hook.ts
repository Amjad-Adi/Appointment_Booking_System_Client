import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../services/axios.ts';

import type { QueryResponse } from '../../../models/Query/query.model.ts';
import type {
    CreateOrganizationByAdmin,
    OrganizationResponse,
    QueryOrganization,
    UpdateOrganization,
    CreateOrganization,
} from '../../../models/organization.model.ts';

import { CURRENT_USER, ORGANIZATION, ORGANIZATION_TABLE } from '../../../utlis/query-keys.ts';
import { toFormData } from '../../../utlis/form-data.ts';
import { useDebouncedQuery } from '../../../hooks/deounce.ts';

export function useOrganizations(query: QueryOrganization) {
    const debouncedQuery = useDebouncedQuery(query);

    return useQuery({
        queryKey: [ORGANIZATION_TABLE, debouncedQuery],
        queryFn: async (): Promise<QueryResponse<OrganizationResponse>> => {
            const response = await api.get<QueryResponse<OrganizationResponse>>(
                '/api/organizations',
                {
                    params: debouncedQuery,
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
        mutationFn: async (
            organization: UpdateOrganization & { picture?: File | null },
        ) => {
            const { uuid, picture, ...organizationData } = organization;
            const formData = toFormData(organizationData);

            if (picture) {
                formData.append('profilePicturePath', picture);
            }

            const response = await api.patch(`/api/organizations/${uuid}`, formData);
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
    });
}

export function useCreateOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            organization: (CreateOrganizationByAdmin | CreateOrganization) & {
                picture?: File | null;
            },
        ) => {
            const { picture, ...organizationData } = organization;
            const formData = toFormData(organizationData);

            if (picture) {
                formData.append('profilePicturePath', picture);
            }

            const response = await api.post('/api/organizations', formData);
            return response.data;
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [CURRENT_USER],
                }),
                queryClient.invalidateQueries({
                    queryKey: [ORGANIZATION_TABLE],
                }),
            ]);
        },
    });
}

export function useCreateOrganizationBySuperAdmin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            organization: (CreateOrganizationByAdmin | CreateOrganization) & {
                picture?: File | null;
            },
        ) => {
            const { picture, ...organizationData } = organization;
            const formData = toFormData(organizationData);

            if (picture) {
                formData.append('profilePicturePath', picture);
            }

            const response = await api.post('/api/organizations', formData);
            return response.data;
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [ORGANIZATION_TABLE],
                }),
            ]);
        },
    });
}
