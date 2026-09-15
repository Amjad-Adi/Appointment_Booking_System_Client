import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
    AppointmentResponse,
    CreateAppointment,
    QueryAppointment,
    UpdateAppointmentByUser,
    UpdateAppointmentByOrganization,
    ConfirmAppointment,
    RejectAppointment,
    UpdateAppointmentStatus,
    PayAppointment,
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

/*
 * Customer / current user's appointments
 */

export function useAppointments(query: QueryAppointment) {
    return useQuery({
        queryKey: [APPOINTMENTS, query],

        queryFn: async (): Promise<QueryResponse<AppointmentResponse>> => {
            const response = await api.get<QueryResponse<AppointmentResponse>>(
                '/api/appointments/me',
                {
                    params: query,
                },
            );

            return response.data;
        },

        placeholderData: keepPreviousData,
    });
}

export function useAppointment(appointmentUuid: string) {
    return useQuery({
        queryKey: [APPOINTMENT, appointmentUuid],

        queryFn: async (): Promise<AppointmentResponse> => {
            const response = await api.get<AppointmentResponse>(
                `/api/appointments/${appointmentUuid}`,
            );

            return response.data;
        },

        enabled: !!appointmentUuid,
    });
}

export function useCreateAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (appointment: CreateAppointment): Promise<AppointmentResponse> => {
            const response = await api.post<AppointmentResponse>('/api/appointments', appointment);

            return response.data;
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [APPOINTMENTS],
            });

            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_APPOINTMENTS],
            });
        },
    });
}

export function useUpdateAppointmentByUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            uuid,
            ...appointment
        }: UpdateAppointmentByUser): Promise<AppointmentResponse> => {
            const response = await api.patch<AppointmentResponse>(
                `/api/appointments/${uuid}`,
                appointment,
            );

            return response.data;
        },

        onSuccess: async (appointment) => {
            await queryClient.invalidateQueries({
                queryKey: [APPOINTMENTS],
            });

            await queryClient.invalidateQueries({
                queryKey: [APPOINTMENT, appointment.uuid],
            });
        },
    });
}

export function useConfirmAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            uuid,
            ...appointment
        }: ConfirmAppointment): Promise<AppointmentResponse> => {
            const response = await api.patch<AppointmentResponse>(
                `/api/appointments/${uuid}/confirm`,
                appointment,
            );

            return response.data;
        },

        onSuccess: async (appointment) => {
            await queryClient.invalidateQueries({
                queryKey: [APPOINTMENTS],
            });

            await queryClient.invalidateQueries({
                queryKey: [APPOINTMENT, appointment.uuid],
            });

            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_APPOINTMENTS],
            });
        },
    });
}

export function useCancelAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (appointmentUuid: string): Promise<AppointmentResponse> => {
            const response = await api.patch<AppointmentResponse>(
                `/api/appointments/${appointmentUuid}/cancel`,
            );

            return response.data;
        },

        onSuccess: async (appointment) => {
            await queryClient.invalidateQueries({
                queryKey: [APPOINTMENTS],
            });

            await queryClient.invalidateQueries({
                queryKey: [APPOINTMENT, appointment.uuid],
            });

            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_APPOINTMENTS],
            });
        },
    });
}

export function usePayAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            uuid,
            ...appointment
        }: PayAppointment): Promise<AppointmentResponse> => {
            const response = await api.patch<AppointmentResponse>(
                `/api/appointments/${uuid}/pay`,
                appointment,
            );

            return response.data;
        },

        onSuccess: async (appointment) => {
            await queryClient.invalidateQueries({
                queryKey: [APPOINTMENTS],
            });

            await queryClient.invalidateQueries({
                queryKey: [APPOINTMENT, appointment.uuid],
            });

            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_APPOINTMENTS],
            });
        },
    });
}

/*
 * Organization appointments
 */

export function useOrganizationAppointments(
    organizationUuid: string | undefined,
    query: QueryAppointment,
) {
    return useQuery({
        queryKey: [ORGANIZATION_APPOINTMENTS, organizationUuid, query],

        queryFn: async (): Promise<QueryResponse<AppointmentResponse>> => {
            const response = await api.get<QueryResponse<AppointmentResponse>>(
                `/api/organizations/${organizationUuid}/appointments`,
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

export function useOrganizationAppointment(
    organizationUuid: string | undefined,
    appointmentUuid: string,
) {
    return useQuery({
        queryKey: [ORGANIZATION_APPOINTMENT, organizationUuid, appointmentUuid],

        queryFn: async (): Promise<AppointmentResponse> => {
            const response = await api.get<AppointmentResponse>(
                `/api/organizations/${organizationUuid}/appointments/${appointmentUuid}`,
            );

            return response.data;
        },

        enabled: !!organizationUuid && !!appointmentUuid,
    });
}

export function useCreateOrganizationAppointment(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            appointment: CreateOrganizationAppointment,
        ): Promise<AppointmentResponse> => {
            if (!organizationUuid) {
                throw new Error('Organization UUID is required');
            }

            const response = await api.post<AppointmentResponse>(
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
export function useUpdateOrganizationAppointment(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            uuid,
            ...appointment
        }: UpdateAppointmentByOrganization): Promise<AppointmentResponse> => {
            const response = await api.patch<AppointmentResponse>(
                `/api/organizations/${organizationUuid}/appointments/${uuid}`,
                appointment,
            );

            return response.data;
        },

        onSuccess: async (appointment) => {
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_APPOINTMENTS],
            });

            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_APPOINTMENT, organizationUuid, appointment.uuid],
            });
        },
    });
}

export function useApproveAppointment(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (appointmentUuid: string): Promise<AppointmentResponse> => {
            const response = await api.patch<AppointmentResponse>(
                `/api/organizations/${organizationUuid}/appointments/${appointmentUuid}/approve`,
            );

            return response.data;
        },

        onSuccess: async (appointment) => {
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_APPOINTMENTS],
            });

            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_APPOINTMENT, organizationUuid, appointment.uuid],
            });

            await queryClient.invalidateQueries({
                queryKey: [APPOINTMENTS],
            });
        },
    });
}

export function useRejectAppointment(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            uuid,
            ...appointment
        }: RejectAppointment): Promise<AppointmentResponse> => {
            const response = await api.patch<AppointmentResponse>(
                `/api/organizations/${organizationUuid}/appointments/${uuid}/reject`,
                appointment,
            );

            return response.data;
        },

        onSuccess: async (appointment) => {
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_APPOINTMENTS],
            });

            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_APPOINTMENT, organizationUuid, appointment.uuid],
            });

            await queryClient.invalidateQueries({
                queryKey: [APPOINTMENTS],
            });
        },
    });
}

export function useUpdateAppointmentStatus(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            uuid,
            ...appointment
        }: UpdateAppointmentStatus): Promise<AppointmentResponse> => {
            const response = await api.patch<AppointmentResponse>(
                `/api/organizations/${organizationUuid}/appointments/${uuid}/status`,
                appointment,
            );

            return response.data;
        },

        onSuccess: async (appointment) => {
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_APPOINTMENTS],
            });

            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_APPOINTMENT, organizationUuid, appointment.uuid],
            });

            await queryClient.invalidateQueries({
                queryKey: [APPOINTMENTS],
            });
        },
    });
}
