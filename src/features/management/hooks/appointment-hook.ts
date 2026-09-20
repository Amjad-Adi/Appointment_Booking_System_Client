import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import type {
    UserAppointmentResponse,
    OrganizationAppointmentResponse,
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

import type {
    QueryResponse,
} from '../../../models/Query/query.model.ts';

import {
    APPOINTMENT,
    APPOINTMENTS,
    ORGANIZATION_APPOINTMENT,
    ORGANIZATION_APPOINTMENTS,
} from '../../../utlis/query-keys.ts';

import { api } from '../../../services/axios.ts';


/*
 * USER appointments.
 */
export function useAppointments(
    query: QueryAppointment,
) {
    return useQuery({
        queryKey: [
            APPOINTMENTS,
            query,
        ],

        queryFn: async (): Promise<
            QueryResponse<UserAppointmentResponse>
        > => {
            const response =
                await api.get<
                    QueryResponse<UserAppointmentResponse>
                >(
                    '/api/appointments/me',
                    {
                        params: query,
                    },
                );

            return response.data;
        },

        placeholderData:
        keepPreviousData,
    });
}


/*
 * USER appointment.
 */
export function useAppointment(
    appointmentUuid: string,
    enabled = true,
) {
    return useQuery({
        queryKey: [
            APPOINTMENT,
            appointmentUuid,
        ],

        queryFn: async (): Promise<
            UserAppointmentResponse
        > => {
            const response =
                await api.get<
                    UserAppointmentResponse
                >(
                    `/api/appointments/${appointmentUuid}`,
                );

            return response.data;
        },

        enabled:
            enabled &&
            !!appointmentUuid,
    });
}


/*
 * USER creates an appointment.
 */
export function useCreateAppointment() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: async (
            appointment: CreateAppointment,
        ): Promise<
            UserAppointmentResponse
        > => {
            const response =
                await api.post<
                    UserAppointmentResponse
                >(
                    '/api/appointments',
                    appointment,
                );

            return response.data;
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [
                    APPOINTMENTS,
                ],
            });

            await queryClient.invalidateQueries({
                queryKey: [
                    ORGANIZATION_APPOINTMENTS,
                ],
            });
        },
    });
}


/*
 * USER updates an appointment.
 */
export function useUpdateAppointmentByUser() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: async ({
                               uuid,
                               ...appointment
                           }: UpdateAppointmentByUser): Promise<
            UserAppointmentResponse
        > => {
            const response =
                await api.patch<
                    UserAppointmentResponse
                >(
                    `/api/appointments/${uuid}`,
                    appointment,
                );

            return response.data;
        },

        onSuccess: async (
            appointment,
        ) => {
            await queryClient.invalidateQueries({
                queryKey: [
                    APPOINTMENTS,
                ],
            });

            await queryClient.invalidateQueries({
                queryKey: [
                    APPOINTMENT,
                    appointment.uuid,
                ],
            });

            await queryClient.invalidateQueries({
                queryKey: [
                    ORGANIZATION_APPOINTMENTS,
                ],
            });
        },
    });
}


/*
 * ORGANIZATION confirms an appointment.
 */
export function useConfirmAppointment() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: async ({
                               uuid,
                               ...appointment
                           }: ConfirmAppointment): Promise<
            OrganizationAppointmentResponse
        > => {
            const response =
                await api.patch<
                    OrganizationAppointmentResponse
                >(
                    `/api/appointments/${uuid}/confirm`,
                    appointment,
                );

            return response.data;
        },

        onSuccess: async (
            appointment,
        ) => {
            await queryClient.invalidateQueries({
                queryKey: [
                    APPOINTMENTS,
                ],
            });

            await queryClient.invalidateQueries({
                queryKey: [
                    APPOINTMENT,
                    appointment.uuid,
                ],
            });

            await queryClient.invalidateQueries({
                queryKey: [
                    ORGANIZATION_APPOINTMENTS,
                ],
            });

            await queryClient.invalidateQueries({
                queryKey: [
                    ORGANIZATION_APPOINTMENT,
                ],
            });
        },
    });
}


/*
 * USER cancels an appointment.
 */
export function useCancelAppointment() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: async (
            appointmentUuid: string,
        ): Promise<
            UserAppointmentResponse
        > => {
            const response =
                await api.patch<
                    UserAppointmentResponse
                >(
                    `/api/appointments/${appointmentUuid}/cancel`,
                );

            return response.data;
        },

        onSuccess: async (
            appointment,
        ) => {
            await queryClient.invalidateQueries({
                queryKey: [APPOINTMENTS],
            });

            await queryClient.invalidateQueries({
                queryKey: [APPOINTMENT, appointment.uuid],
            });

            await queryClient.invalidateQueries({
                queryKey: [
                    ORGANIZATION_APPOINTMENTS,
                ],
        });

            await queryClient.invalidateQueries({
                queryKey: [
                    ORGANIZATION_APPOINTMENT,
                ],
            });
        },
        });
}


    /*
     * USER pays an appointment.
     */
    export function usePayAppointment() {
        const queryClient =
            useQueryClient();

        return useMutation({
            mutationFn: async ({
                                   uuid,
                                   ...appointment
                               }: PayAppointment): Promise<
                UserAppointmentResponse
            > => {
                const response =
                    await api.patch<
                        UserAppointmentResponse
                    >(
                        `/api/appointments/${uuid}/pay`,
                        appointment,
                    );

                return response.data;
            },

            onSuccess: async (
                appointment,
            ) => {
                await queryClient.invalidateQueries({
                    queryKey: [
                        APPOINTMENTS,
                    ],
                });

                await queryClient.invalidateQueries({
                    queryKey: [
                        APPOINTMENT,
                        appointment.uuid,
                    ],
                });

                await queryClient.invalidateQueries({
                    queryKey: [
                        ORGANIZATION_APPOINTMENTS,
                    ],
            });

                await queryClient.invalidateQueries({
                    queryKey: [
                        ORGANIZATION_APPOINTMENT,
                    ],
                });
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
            return useQuery({
                queryKey: [
                    ORGANIZATION_APPOINTMENTS,
                    organizationUuid,
                    query,
                ],

                queryFn: async (): Promise<
                    QueryResponse<
                        OrganizationAppointmentResponse
                    >
                > => {
                    const response =
                        await api.get<
                            QueryResponse<
                                OrganizationAppointmentResponse
                            >
                        >(
                            `/api/organizations/${organizationUuid}/appointments`,
                            {
                                params: query,
                            },
                        );

                    return response.data;
                },

                enabled:
                    !!organizationUuid,

                placeholderData:
                keepPreviousData,
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
                queryKey: [
                    ORGANIZATION_APPOINTMENT,
                    organizationUuid,
                    appointmentUuid,
                ],

                queryFn: async (): Promise<
                    OrganizationAppointmentResponse
                > => {
                    if (!organizationUuid) {
                        throw new Error(
                            'Organization UUID is required',
                        );
                    }

                    const response =
                        await api.get<
                            OrganizationAppointmentResponse
                        >(
                            `/api/organizations/${organizationUuid}/appointments/${appointmentUuid}`,
                        );

                    return response.data;
                },

                enabled:
                    enabled &&
                    !!organizationUuid &&
                    !!appointmentUuid,
            });
        }


        /*
         * ORGANIZATION creates an appointment.
         */
        export function useCreateOrganizationAppointment(
            organizationUuid: string | undefined,
        ) {
            const queryClient =
                useQueryClient();

            return useMutation({
                mutationFn: async (
                    appointment: CreateOrganizationAppointment,
                ): Promise<
                    OrganizationAppointmentResponse
                > => {
                    if (!organizationUuid) {
                        throw new Error(
                            'Organization UUID is required',
                        );
                    }

                    const response =
                        await api.post<
                            OrganizationAppointmentResponse
                        >(
                            `/api/organizations/${organizationUuid}/appointments`,
                            appointment,
                        );

                    return response.data;
                },

                onSuccess: async () => {
                    await queryClient.invalidateQueries({
                        queryKey: [
                            ORGANIZATION_APPOINTMENTS,
                        ],
                    });
                },
            });
        }


        /*
         * ORGANIZATION updates an appointment.
         */
        export function useUpdateOrganizationAppointment(
            organizationUuid: string | undefined,
        ) {
            const queryClient =
                useQueryClient();

            return useMutation({
                mutationFn: async ({
                                       uuid,
                                       ...appointment
                                   }: UpdateAppointmentByOrganization): Promise<
                    OrganizationAppointmentResponse
                > => {
                    if (!organizationUuid) {
                        throw new Error(
                            'Organization UUID is required',
                        );
                    }

                    const response =
                        await api.patch<
                            OrganizationAppointmentResponse
                        >(
                            `/api/organizations/${organizationUuid}/appointments/${uuid}`,
                            appointment,
                        );

                    return response.data;
                },

                onSuccess: async (
                    appointment,
                ) => {
                    await queryClient.invalidateQueries({
                        queryKey: [
                            ORGANIZATION_APPOINTMENTS,
                        ],
                    });

                    await queryClient.invalidateQueries({
                        queryKey: [
                            ORGANIZATION_APPOINTMENT,
                            organizationUuid,
                            appointment.uuid,
                        ],
                    });

                    await queryClient.invalidateQueries({
                        queryKey: [
                            APPOINTMENT,
                            appointment.uuid,
                        ],
                    });
                },
            });
        }


        /*
         * ORGANIZATION approves an appointment.
         */
        export function useApproveAppointment(
            organizationUuid: string | undefined,
        ) {
            const queryClient =
                useQueryClient();

            return useMutation({
                mutationFn: async (
                    appointmentUuid: string,
                ): Promise<
                    OrganizationAppointmentResponse
                > => {
                    if (!organizationUuid) {
                        throw new Error(
                            'Organization UUID is required',
                        );
                    }

                    const response =
                        await api.patch<
                            OrganizationAppointmentResponse
                        >(
                            `/api/organizations/${organizationUuid}/appointments/${appointmentUuid}/approve`,
                        );

                    return response.data;
                },

                onSuccess: async (
                    appointment,
                ) => {
                    await queryClient.invalidateQueries({
                        queryKey: [
                            ORGANIZATION_APPOINTMENTS,
                        ],
                    });

                    await queryClient.invalidateQueries({
                        queryKey: [
                            ORGANIZATION_APPOINTMENT,
                            organizationUuid,
                            appointment.uuid,
                        ],
                    });

                    await queryClient.invalidateQueries({
                        queryKey: [
                            APPOINTMENT,
                            appointment.uuid,
                        ],
                    });

                    await queryClient.invalidateQueries({
                        queryKey: [
                            APPOINTMENTS,
                        ],
                    });
                },
            });
        }


        /*
         * ORGANIZATION rejects an appointment.
         */
        export function useRejectAppointment(
            organizationUuid: string | undefined,
        ) {
            const queryClient =
                useQueryClient();

            return useMutation({
                mutationFn: async ({
                                       uuid,
                                       ...appointment
                                   }: RejectAppointment): Promise<
                    OrganizationAppointmentResponse
                > => {
                    if (!organizationUuid) {
                        throw new Error(
                            'Organization UUID is required',
                        );
                    }

                    const response =
                        await api.patch<
                            OrganizationAppointmentResponse
                        >(
                            `/api/organizations/${organizationUuid}/appointments/${uuid}/reject`,
                            appointment,
                        );

                    return response.data;
                },

                onSuccess: async (
                    appointment,
                ) => {
                    await queryClient.invalidateQueries({
                        queryKey: [
                            ORGANIZATION_APPOINTMENTS,
                        ],
                    });

                    await queryClient.invalidateQueries({
                        queryKey: [
                            ORGANIZATION_APPOINTMENT,
                            organizationUuid,
                            appointment.uuid,
                        ],
                    });

                    await queryClient.invalidateQueries({
                        queryKey: [
                            APPOINTMENT,
                            appointment.uuid,
                        ],
                    });

                    await queryClient.invalidateQueries({
                        queryKey: [
                            APPOINTMENTS,
                        ],
                    });
                },
            });
        }


        /*
         * ORGANIZATION updates appointment status.
         */
        export function useUpdateAppointmentStatus(
            organizationUuid: string | undefined,
        ) {
            const queryClient =
                useQueryClient();

            return useMutation({
                mutationFn: async ({
                                       uuid,
                                       ...appointment
                                   }: UpdateAppointmentStatus): Promise<
                    OrganizationAppointmentResponse
                > => {
                    if (!organizationUuid) {
                        throw new Error(
                            'Organization UUID is required',
                        );
                    }

                    const response =
                        await api.patch<
                            OrganizationAppointmentResponse
                        >(
                            `/api/organizations/${organizationUuid}/appointments/${uuid}/status`,
                            appointment,
                        );

                    return response.data;
                },

                onSuccess: async (
                    appointment,
                ) => {
                    await queryClient.invalidateQueries({
                        queryKey: [
                            ORGANIZATION_APPOINTMENTS,
                        ],
                    });

                    await queryClient.invalidateQueries({
                        queryKey: [
                            ORGANIZATION_APPOINTMENT,
                            organizationUuid,
                            appointment.uuid,
                        ],
                    });

                    await queryClient.invalidateQueries({
                        queryKey: [
                            APPOINTMENT,
                            appointment.uuid,
                        ],
                    });

                    await queryClient.invalidateQueries({
                        queryKey: [
                            APPOINTMENTS,
                        ],
                    });
                },
            });
        }