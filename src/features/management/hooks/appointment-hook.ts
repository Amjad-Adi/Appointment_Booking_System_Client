import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
    UserAppointmentResponse,
    OrganizationAppointmentResponse,
    CreateAppointment,
    QueryAppointment,
    UpdateAppointmentByUser,
    UpdateAppointmentByOrganization,
    CreateOrganizationAppointment,
} from '../../../models/appointment.model.ts';

import type { QueryResponse } from '../../../models/Query/query.model.ts';

import {
    APPOINTMENT,
    APPOINTMENTS,
    ORGANIZATION_APPOINTMENT,
    ORGANIZATION_APPOINTMENTS,
} from '../../../utlis/query-keys.ts';

import { api } from '../../../services/axios.ts';
import { useDebouncedQuery } from '../../../hooks/deounce.ts';

/*
 * USER appointments.
 */
export function useAppointments(query: QueryAppointment) {
    const debouncedQuery = useDebouncedQuery(query);

    return useQuery({
        queryKey: [APPOINTMENTS, debouncedQuery],

        queryFn: async (): Promise<QueryResponse<UserAppointmentResponse>> => {
            const response = await api.get<QueryResponse<UserAppointmentResponse>>(
                '/api/appointments/me',
                {
                    params: debouncedQuery,
                },
            );

            return response.data;
        },

        placeholderData: keepPreviousData,
    });
}

/*
 * USER appointment.
 */
export function useAppointment(appointmentUuid: string, enabled = true) {
    return useQuery({
        queryKey: [APPOINTMENT, appointmentUuid],

        queryFn: async (): Promise<UserAppointmentResponse> => {
            const response = await api.get<UserAppointmentResponse>(
                `/api/appointments/${appointmentUuid}`,
            );

            return response.data;
        },

        enabled: enabled && !!appointmentUuid,
    });
}

/*
 * USER creates an appointment.
 *
 * The organization is part of the payload for customers because
 * customers do not belong to the organization themselves.
 */
export function useCreateAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (appointment: CreateAppointment): Promise<UserAppointmentResponse> => {
            const response = await api.post<UserAppointmentResponse>(
                '/api/appointments',
                appointment,
            );

            return response.data;
        },

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [APPOINTMENTS],
                }),
                queryClient.invalidateQueries({
                    queryKey: [ORGANIZATION_APPOINTMENTS],
                }),
            ]);
        },
    });
}

/*
 * USER updates an appointment.
 */
export function useUpdateAppointmentByUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            uuid,
            ...appointment
        }: UpdateAppointmentByUser & { uuid: string }): Promise<UserAppointmentResponse> => {
            const response = await api.patch<UserAppointmentResponse>(
                `/api/appointments/${uuid}`,
                appointment,
            );

            return response.data;
        },

        onSuccess: async (appointment) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [APPOINTMENTS],
                }),
                queryClient.invalidateQueries({
                    queryKey: [APPOINTMENT, appointment.uuid],
                }),
                queryClient.invalidateQueries({
                    queryKey: [ORGANIZATION_APPOINTMENTS],
                }),
            ]);
        },
    });
}

/*
 * USER cancels an appointment.
 */
export function useCancelAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (appointmentUuid: string): Promise<UserAppointmentResponse> => {
            const response = await api.patch<UserAppointmentResponse>(
                `/api/appointments/${appointmentUuid}/cancel`,
            );

            return response.data;
        },

        onSuccess: async (appointment) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [APPOINTMENTS],
                }),
                queryClient.invalidateQueries({
                    queryKey: [APPOINTMENT, appointment.uuid],
                }),
                queryClient.invalidateQueries({
                    queryKey: [ORGANIZATION_APPOINTMENTS],
                }),
                queryClient.invalidateQueries({
                    queryKey: [ORGANIZATION_APPOINTMENT],
                }),
            ]);
        },
    });
}

/*
 * ORGANIZATION appointments.
 */
export function useOrganizationAppointments(
    organizationUuid: string | undefined,
    query: QueryAppointment,
) {
    const debouncedQuery = useDebouncedQuery(query);

    return useQuery({
        queryKey: [ORGANIZATION_APPOINTMENTS, organizationUuid, debouncedQuery],

        queryFn: async (): Promise<QueryResponse<OrganizationAppointmentResponse>> => {
            const response = await api.get<QueryResponse<OrganizationAppointmentResponse>>(
                `/api/organizations/${organizationUuid}/appointments`,
                {
                    params: debouncedQuery,
                },
            );

            return response.data;
        },

        enabled: !!organizationUuid,

        placeholderData: keepPreviousData,
    });
}

/*
 * ORGANIZATION appointment.
 */
export function useOrganizationAppointment(
    organizationUuid: string | undefined,
    appointmentUuid: string,
    enabled = true,
) {
    return useQuery({
        queryKey: [ORGANIZATION_APPOINTMENT, organizationUuid, appointmentUuid],

        queryFn: async (): Promise<OrganizationAppointmentResponse> => {
            if (!organizationUuid) {
                throw new Error('Organization UUID is required');
            }

            const response = await api.get<OrganizationAppointmentResponse>(
                `/api/organizations/${organizationUuid}/appointments/${appointmentUuid}`,
            );

            return response.data;
        },

        enabled: enabled && !!organizationUuid && !!appointmentUuid,
    });
}

/*
 * ORGANIZATION creates an appointment.
 */
export function useCreateOrganizationAppointment(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            appointment: CreateOrganizationAppointment,
        ): Promise<OrganizationAppointmentResponse> => {
            if (!organizationUuid) {
                throw new Error('Organization UUID is required');
            }

            const response = await api.post<OrganizationAppointmentResponse>(
                `/api/organizations/${organizationUuid}/appointments`,
                appointment,
            );

            return response.data;
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_APPOINTMENTS],
            });
        },
    });
}

/*
 * ORGANIZATION updates an appointment (including status transitions).
 *
 * The server accepts organizationTitle, organizationNote, organizationColour,
 * appointmentStatus, rejectionReason, paymentMethod and paymentStatus here.
 */
export function useUpdateOrganizationAppointment(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            uuid,
            ...appointment
        }: UpdateAppointmentByOrganization & {
            uuid: string;
        }): Promise<OrganizationAppointmentResponse> => {
            if (!organizationUuid) {
                throw new Error('Organization UUID is required');
            }

            const response = await api.patch<OrganizationAppointmentResponse>(
                `/api/organizations/${organizationUuid}/appointments/${uuid}`,
                appointment,
            );

            return response.data;
        },

        onSuccess: async (appointment) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [ORGANIZATION_APPOINTMENTS],
                }),
                queryClient.invalidateQueries({
                    queryKey: [ORGANIZATION_APPOINTMENT, organizationUuid, appointment.uuid],
                }),
                queryClient.invalidateQueries({
                    queryKey: [APPOINTMENT, appointment.uuid],
                }),
            ]);
        },
    });
}
