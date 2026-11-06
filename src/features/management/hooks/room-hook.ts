import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
    CreateRoom,
    QueryRoom,
    RoomResponse,
    UpdateRoom,
} from '../../../models/room.model.ts';

import type { QueryResponse } from '../../../models/Query/query.model.ts';

import { ROOM, ROOMS, ORGANIZATION_ROOM, ORGANIZATION_ROOMS } from '../../../utlis/query-keys.ts';

import { api } from '../../../services/axios.ts';
import { useDebouncedQuery } from '../../../hooks/deounce.ts';

/*
 * =========================
 * Public
 * =========================
 */

export function useOrganizationRooms(organizationUuid: string | undefined, query: QueryRoom) {
    const debouncedQuery = useDebouncedQuery(query);

    return useQuery({
        queryKey: [ORGANIZATION_ROOMS, organizationUuid, debouncedQuery],

        queryFn: async (): Promise<QueryResponse<RoomResponse>> => {
            const response = await api.get<QueryResponse<RoomResponse>>(
                `/api/organizations/${organizationUuid}/rooms`,
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

export function useOrganizationRoom(
    organizationUuid: string | undefined,
    roomUuid: string | undefined,
) {
    return useQuery({
        queryKey: [ORGANIZATION_ROOM, organizationUuid, roomUuid],

        queryFn: async (): Promise<RoomResponse> => {
            const response = await api.get<RoomResponse>(
                `/api/organizations/${organizationUuid}/rooms/${roomUuid}`,
            );

            return response.data;
        },

        enabled: !!organizationUuid && !!roomUuid,
    });
}

export function useCreateOrganizationRoom(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            room: Omit<CreateRoom, 'organizationUuid' | 'userUuid'>,
        ): Promise<RoomResponse> => {
            if (!organizationUuid) {
                throw new Error('Organization UUID is required');
            }

            const response = await api.post<RoomResponse>(
                `/api/organizations/${organizationUuid}/rooms`,
                room,
            );

            return response.data;
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_ROOMS, organizationUuid],
            });
        },
    });
}

export function useUpdateOrganizationRoom(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            uuid,
            ...room
        }: Omit<UpdateRoom, 'organizationUuid' | 'userUuid'> & {
            uuid: string;
        }): Promise<RoomResponse> => {
            if (!organizationUuid) {
                throw new Error('Organization UUID is required');
            }

            const response = await api.patch<RoomResponse>(
                `/api/organizations/${organizationUuid}/rooms/${uuid}`,
                room,
            );

            return response.data;
        },

        onSuccess: async (room) => {
            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_ROOMS, organizationUuid],
            });

            await queryClient.invalidateQueries({
                queryKey: [ORGANIZATION_ROOM, organizationUuid, room.uuid],
            });
        },
    });
}
