import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../services/axios.ts';
import type { QueryResponse } from '../../../models/Query/query.model.ts';
import type {
    CreateCustomerInvitation,
    CustomerInvitationResponse,
    QueryCustomerInvitation,
} from '../../../models/customer-invitation.model.ts';
import { CustomerInvitationStatus } from '../../../models/enums/customer-invitation-status.ts';
import {
    CUSTOMER_INVITATIONS,
    ORGANIZATION_CUSTOMER_INVITATIONS,
} from '../../../utlis/query-keys.ts';
import { useDebouncedQuery } from '../../../hooks/deounce.ts';

export function useOrganizationCustomerInvitations(
    organizationUuid: string | undefined,
    query: QueryCustomerInvitation,
    enabled = true,
) {
    const debouncedQuery = useDebouncedQuery(query);

    return useQuery({
        queryKey: [ORGANIZATION_CUSTOMER_INVITATIONS, organizationUuid, debouncedQuery],
        queryFn: async (): Promise<QueryResponse<CustomerInvitationResponse>> => {
            const response = await api.get<QueryResponse<CustomerInvitationResponse>>(
                `/api/organizations/${organizationUuid}/customer-invitations`,
                { params: debouncedQuery },
            );

            return response.data;
        },
        enabled: enabled && !!organizationUuid,
        placeholderData: keepPreviousData,
    });
}

export function useCreateCustomerInvitation(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            invitation: CreateCustomerInvitation,
        ): Promise<CustomerInvitationResponse> => {
            const response = await api.post<CustomerInvitationResponse>(
                `/api/organizations/${organizationUuid}/customer-invitations`,
                invitation,
            );

            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_CUSTOMER_INVITATIONS, organizationUuid],
            });
        },
    });
}

export function useCancelCustomerInvitation(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (invitationUuid: string) => {
            const response = await api.patch(
                `/api/organizations/${organizationUuid}/customer-invitations/${invitationUuid}`,
                { status: CustomerInvitationStatus.CANCELLED },
            );

            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_CUSTOMER_INVITATIONS, organizationUuid],
            });
        },
    });
}

export function useMyCustomerInvitations(query: QueryCustomerInvitation) {
    const debouncedQuery = useDebouncedQuery(query);

    return useQuery({
        queryKey: [CUSTOMER_INVITATIONS, debouncedQuery],
        queryFn: async (): Promise<QueryResponse<CustomerInvitationResponse>> => {
            const response = await api.get<QueryResponse<CustomerInvitationResponse>>(
                '/api/customer-invitations/me',
                { params: debouncedQuery },
            );

            return response.data;
        },
        placeholderData: keepPreviousData,
    });
}

export function useRespondToCustomerInvitation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            invitationUuid,
            status,
        }: {
            invitationUuid: string;
            status: CustomerInvitationStatus;
        }) => {
            const response = await api.patch(`/api/customer-invitations/${invitationUuid}`, {
                status,
            });

            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [CUSTOMER_INVITATIONS] });
        },
    });
}
