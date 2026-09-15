import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { QueryResponse } from '../../../models/Query/query.model.ts';

import type {
    CreateTimeBlock,
    QueryTimeBlock,
    TimeBlock,
    TimeBlockResponse,
    UpdateTimeBlock,
} from '../../../models/time-block.ts';

import { ORGANIZATION_TIME_BLOCK, ORGANIZATION_TIME_BLOCKS } from '../../../utlis/query-keys.ts';

import { api } from '../../../services/axios.ts';

export function useOrganizationTimeBlocks(
    organizationUuid: string | undefined,
    query: QueryTimeBlock,
) {
    return useQuery({
        queryKey: [ORGANIZATION_TIME_BLOCKS, organizationUuid, query],

        queryFn: async (): Promise<QueryResponse<TimeBlockResponse>> => {
            const response = await api.get<QueryResponse<TimeBlockResponse>>(
                `/api/organizations/${organizationUuid}/time-blocks`,
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

export function useOrganizationTimeBlock(
    organizationUuid: string | undefined,
    timeBlockUuid: string,
) {
    return useQuery({
        queryKey: [ORGANIZATION_TIME_BLOCK, organizationUuid, timeBlockUuid],

        queryFn: async (): Promise<TimeBlockResponse> => {
            const response = await api.get<TimeBlockResponse>(
                `/api/organizations/${organizationUuid}/time-blocks/${timeBlockUuid}`,
            );

            return response.data;
        },

        enabled: !!organizationUuid && !!timeBlockUuid,
    });
}

export function useCreateOrganizationTimeBlock(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (timeBlock: CreateTimeBlock): Promise<TimeBlock> => {
            if (!organizationUuid) {
                throw new Error('Organization UUID is required');
            }

            const response = await api.post<TimeBlock>(
                `/api/organizations/${organizationUuid}/time-blocks`,
                timeBlock,
            );

            return response.data;
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_TIME_BLOCKS],
            });
        },
    });
}

export function useUpdateOrganizationTimeBlock(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ uuid, ...timeBlock }: UpdateTimeBlock): Promise<TimeBlock> => {
            if (!organizationUuid) {
                throw new Error('Organization UUID is required');
            }

            const response = await api.patch<TimeBlock>(
                `/api/organizations/${organizationUuid}/time-blocks/${uuid}`,
                timeBlock,
            );

            return response.data;
        },

        onSuccess: async (timeBlock) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [ORGANIZATION_TIME_BLOCKS],
                }),

                queryClient.invalidateQueries({
                    queryKey: [ORGANIZATION_TIME_BLOCK, organizationUuid, timeBlock.uuid],
                }),
            ]);
        },
    });
}
