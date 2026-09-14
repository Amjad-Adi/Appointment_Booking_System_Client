import type {
    CreateRoom,
    QueryRoom,
    RoomResponse,
    UpdateRoom,
} from '../../../models/room.model.ts';

import { ROOM, ROOMS } from '../../../utlis/query-keys.ts';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { QueryResponse } from '../../../models/Query/query.model.ts';
import { api } from '../../../services/axios.ts';

export function useRooms(query: QueryRoom) {
    return useQuery({
        queryKey: [ROOMS, query],
        queryFn: async (): Promise<QueryResponse<RoomResponse>> => {
            const response = await api.get<QueryResponse<RoomResponse>>('/api/rooms', {
                params: query,
            });

            return response.data;
        },
        placeholderData: keepPreviousData,
    });
}

export function useRoom(roomUuid: string) {
    return useQuery({
        queryKey: [ROOM, roomUuid],
        queryFn: async () => {
            const response = await api.get<RoomResponse>(`/api/rooms/${roomUuid}`);

            return response.data;
        },
        enabled: !!roomUuid,
    });
}

export function useCreateOrganizationRoom(organizationUuid: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (room: CreateRoom) => {
            const response = await api.post<RoomResponse>(
                `/api/organizations/${organizationUuid}/rooms`,
                room,
            );

            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [ROOMS],
            });
        },
    });
}

export function useUpdateOrganizationRoom(organizationUuid: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ uuid, ...room }: UpdateRoom & { uuid: string }) => {
            const response = await api.patch<RoomResponse>(
                `/api/organizations/${organizationUuid}/rooms/${uuid}`,
                room,
            );
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [ROOMS],
            });
        },
    });
}
