import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
    CreateSpecialDay,
    SpecialDay,
    UpdateSpecialDay,
} from '../../../models/special-days.model.ts';

import { ORGANIZATION_SPECIAL_DAY, ORGANIZATION_SPECIAL_DAYS } from '../../../utlis/query-keys.ts';

import { api } from '../../../services/axios.ts';

export function useOrganizationSpecialDays(organizationUuid: string | undefined) {
    return useQuery({
        queryKey: [ORGANIZATION_SPECIAL_DAYS, organizationUuid],

        queryFn: async (): Promise<SpecialDay[]> => {
            const response = await api.get<SpecialDay[]>(
                `/api/organizations/${organizationUuid}/special-days`,
            );

            return response.data;
        },

        enabled: !!organizationUuid,
    });
}

export function useOrganizationSpecialDay(
    organizationUuid: string | undefined,
    specialDayUuid: string,
) {
    return useQuery({
        queryKey: [ORGANIZATION_SPECIAL_DAY, organizationUuid, specialDayUuid],

        queryFn: async (): Promise<SpecialDay> => {
            const response = await api.get<SpecialDay>(
                `/api/organizations/${organizationUuid}/special-days/${specialDayUuid}`,
            );

            return response.data;
        },

        enabled: !!organizationUuid && !!specialDayUuid,
    });
}

export function useCreateOrganizationSpecialDay(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (specialDay: CreateSpecialDay): Promise<SpecialDay> => {
            if (!organizationUuid) {
                throw new Error('Organization UUID is required');
            }

            const response = await api.post<SpecialDay>(
                `/api/organizations/${organizationUuid}/special-days`,
                specialDay,
            );

            return response.data;
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_SPECIAL_DAYS, organizationUuid],
            });
        },
    });
}

export function useUpdateOrganizationSpecialDay(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ uuid, ...specialDay }: UpdateSpecialDay): Promise<SpecialDay> => {
            if (!organizationUuid) {
                throw new Error('Organization UUID is required');
            }

            const response = await api.patch<SpecialDay>(
                `/api/organizations/${organizationUuid}/special-days/${uuid}`,
                specialDay,
            );

            return response.data;
        },

        onSuccess: async (specialDay) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [ORGANIZATION_SPECIAL_DAYS, organizationUuid],
                }),

                queryClient.invalidateQueries({
                    queryKey: [ORGANIZATION_SPECIAL_DAY, organizationUuid, specialDay.uuid],
                }),
            ]);
        },
    });
}
