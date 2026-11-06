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
import { useDebouncedQuery } from '../../../hooks/deounce.ts';

export function useOrganizationInvitations(
    organizationUuid: string | undefined,
    query: QueryInvitation,
) {
    const debouncedQuery = useDebouncedQuery(query);

    return useQuery({
        queryKey: [ORGANIZATION_INVITATIONS, organizationUuid, debouncedQuery],
        queryFn: async (): Promise<QueryResponse<InvitationResponse>> => {
            const response = await api.get<QueryResponse<InvitationResponse>>(
                `/api/organizations/${organizationUuid}/invitations`,
                { params: debouncedQuery },
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

export interface AcceptInvitationPayload {
    token: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
    language: string;
    profilePicture?: File | null;
}

export function useAcceptInvitation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            token,
            profilePicture,
            ...values
        }: AcceptInvitationPayload): Promise<InvitationResponse> => {
            const body = new FormData();

            body.append('firstName', values.firstName);
            body.append('lastName', values.lastName);
            body.append('password', values.password);
            body.append('confirmPassword', values.confirmPassword);
            body.append('language', values.language);

            if (profilePicture) {
                body.append('profilePicture', profilePicture);
            }

            const response = await api.post<InvitationResponse>(
                `/api/invitations/${token}/accept`,
                body,
            );

            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
}
