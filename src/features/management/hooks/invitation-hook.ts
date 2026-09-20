import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/axios.ts';
import type { QueryResponse } from '../../../models/Query/query.model.ts';
import type {
    CreateInvitation,
    InvitationResponse,
    QueryInvitation,
    UpdateInvitation,
} from '../../../models/invitation.model.ts';
import {
    ORGANIZATION_INVITATION,
    ORGANIZATION_INVITATIONS,
    PUBLIC_INVITATION,
} from '../../../utlis/query-keys.ts';

export function useOrganizationInvitations(
    organizationUuid: string | undefined,
    query: QueryInvitation,
) {
    return useQuery({
        queryKey: [ORGANIZATION_INVITATIONS, organizationUuid, query],
        queryFn: async (): Promise<QueryResponse<InvitationResponse>> => {
            const response = await api.get<QueryResponse<InvitationResponse>>(
                `/api/organizations/${organizationUuid}/invitations`,
                { params: query },
            );
            return response.data;
        },
        enabled: !!organizationUuid,
        placeholderData: keepPreviousData,
    });
}

export function useCreateOrganizationInvitation(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (invitation: CreateInvitation): Promise<InvitationResponse> => {
            if (!organizationUuid) throw new Error('Organization UUID is required');
            const response = await api.post<InvitationResponse>(
                `/api/organizations/${organizationUuid}/invitations`,
                invitation,
            );
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_INVITATIONS, organizationUuid],
            });
        },
    });
}

export function useUpdateOrganizationInvitation(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            uuid,
            ...invitation
        }: UpdateInvitation & { uuid: string }): Promise<InvitationResponse> => {
            if (!organizationUuid) throw new Error('Organization UUID is required');
            const response = await api.patch<InvitationResponse>(
                `/api/organizations/${organizationUuid}/invitations/${uuid}`,
                invitation,
            );
            return response.data;
        },
        onSuccess: async (invitation) => {
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_INVITATIONS, organizationUuid],
            });
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_INVITATION, organizationUuid, invitation.uuid],
            });
            await queryClient.invalidateQueries({
                queryKey: [PUBLIC_INVITATION, invitation.uuid],
            });
        },
    });
}

export function usePublicInvitation(token: string | undefined) {
    return useQuery({
        queryKey: [PUBLIC_INVITATION, token],
        queryFn: async (): Promise<InvitationResponse> => {
            const response = await api.get<InvitationResponse>(`/api/invitations/${token}`);
            return response.data;
        },
        enabled: !!token,
        retry: false,
    });
}

export function useAcceptInvitation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (token: string): Promise<InvitationResponse> => {
            const response = await api.post<InvitationResponse>(`/api/invitations/${token}/accept`);
            return response.data;
        },
        onSuccess: async () => {
            // Invalidate current user context to potentially fetch new roles/orgs
            await queryClient.invalidateQueries();
        },
    });
}