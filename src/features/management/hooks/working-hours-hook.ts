import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
    QueryWorkingHours,
    UpdateWorkingHours,
    WorkingHours,
    WorkingHoursResponse,
} from '../../../models/working-hours.model.ts';

import {
    ORGANIZATION_WORKING_HOUR,
    ORGANIZATION_WORKING_HOURS,
} from '../../../utlis/query-keys.ts';

import { api } from '../../../services/axios.ts';

import type { QueryResponse } from '../../../models/Query/query.model.ts';

export function useOrganizationWorkingHours(
    organizationUuid: string | undefined,
    query: QueryWorkingHours,
) {
    return useQuery({
        queryKey: [ORGANIZATION_WORKING_HOURS, organizationUuid, query],

        queryFn: async (): Promise<QueryResponse<WorkingHoursResponse>> => {
            const response = await api.get<QueryResponse<WorkingHoursResponse>>(
                `/api/organizations/${organizationUuid}/working-hours`,
                {
                    params: query,
                },
            );

            return response.data;
        },
        enabled: !!organizationUuid,
    });
}

export function useOrganizationWorkingHour(
    organizationUuid: string | undefined,
    workingHoursUuid: string,
) {
    return useQuery({
        queryKey: [ORGANIZATION_WORKING_HOUR, organizationUuid, workingHoursUuid],

        queryFn: async (): Promise<WorkingHours> => {
            const response = await api.get<WorkingHoursResponse>(
                `/api/organizations/${organizationUuid}/working-hours/${workingHoursUuid}`,
            );

            return response.data;
        },

        enabled: !!organizationUuid && !!workingHoursUuid,
    });
}

/**
 * Update one working-hours day.
 */
export function useUpdateOrganizationWorkingHours(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            uuid,
            ...workingHours
        }: UpdateWorkingHours): Promise<WorkingHours> => {
            if (!organizationUuid) {
                throw new Error('Organization UUID is required');
            }

            const response = await api.patch<WorkingHours>(
                `/api/organizations/${organizationUuid}/working-hours/${uuid}`,
                workingHours,
            );

            return response.data;
        },

        onSuccess: async (workingHours) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [ORGANIZATION_WORKING_HOURS, organizationUuid],
                }),

                queryClient.invalidateQueries({
                    queryKey: [ORGANIZATION_WORKING_HOUR, organizationUuid, workingHours.uuid],
                }),
            ]);
        },
    });
}
