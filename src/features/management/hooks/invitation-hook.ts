import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
    CreateInvitation,
    InvitationResponse,
    QueryInvitation,
    UpdateInvitation,
} from '../../../models/invitation.model.ts';

import type { QueryResponse } from '../../../models/Query/query.model.ts';

import {
    INVITATION,
    ORGANIZATION_INVITATION,
    ORGANIZATION_INVITATIONS,
} from '../../../utlis/query-keys.ts';

import { api } from '../../../services/axios.ts';

/*
 * =========================
 * Public
 * =========================
 */

export function useOrganizationInvitations(
    organizationUuid: string | undefined,
    query: QueryInvitation,
) {
    return useQuery({
        queryKey: [ORGANIZATION_INVITATIONS, organizationUuid, query],

        queryFn: async (): Promise<QueryResponse<InvitationResponse>> => {
            const response = await api.get<QueryResponse<InvitationResponse>>(
                `/api/organizations/${organizationUuid}/invitations`,
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

export function useOrganizationInvitation(
    organizationUuid: string | undefined,
    invitationUuid: string | undefined,
) {
    return useQuery({
        queryKey: [ORGANIZATION_INVITATION, organizationUuid, invitationUuid],

        queryFn: async (): Promise<InvitationResponse> => {
            const response = await api.get<InvitationResponse>(
                `/api/organizations/${organizationUuid}/invitations/${invitationUuid}`,
            );

            return response.data;
        },

        enabled: !!organizationUuid && !!invitationUuid,
    });
}

export function useInvitation(invitationUuid: string | undefined) {
    return useQuery({
        queryKey: [INVITATION, invitationUuid],

        queryFn: async (): Promise<InvitationResponse> => {
            const response = await api.get<InvitationResponse>(
                `/api/invitations/${invitationUuid}`,
            );

            return response.data;
        },

        enabled: !!invitationUuid,
    });
}

export function useCreateOrganizationInvitation(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (invitation: CreateInvitation): Promise<InvitationResponse> => {
            if (!organizationUuid) {
                throw new Error('Organization UUID is required');
            }

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
        }: UpdateInvitation & {
            uuid: string;
        }): Promise<InvitationResponse> => {
            if (!organizationUuid) {
                throw new Error('Organization UUID is required');
            }

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
                queryKey: [INVITATION, invitation.uuid],
            });
        },
    });
}
