import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../services/axios.ts';
import type { QueryResponse } from '../../../models/Query/query.model.ts';
import type { FavouriteServiceResponse, QueryFavourite } from '../../../models/favourite.model.ts';
import { FAVOURITES, SERVICE_TABLE, SERVICE } from '../../../utlis/query-keys.ts';
import { useDebouncedQuery } from '../../../hooks/deounce.ts';

export function useFavourites(query: QueryFavourite, enabled = true) {
    const debouncedQuery = useDebouncedQuery(query);

    return useQuery({
        queryKey: [FAVOURITES, debouncedQuery],
        queryFn: async (): Promise<QueryResponse<FavouriteServiceResponse>> => {
            const response = await api.get<QueryResponse<FavouriteServiceResponse>>(
                '/api/favourites',
                { params: debouncedQuery },
            );

            return response.data;
        },
        enabled,
        placeholderData: keepPreviousData,
    });
}

export function useAddFavourite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (serviceUuid: string) => {
            const response = await api.post('/api/favourites', { serviceUuid });
            return response.data;
        },
        onSuccess: async (_data, serviceUuid) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: [FAVOURITES] }),
                queryClient.invalidateQueries({ queryKey: [SERVICE_TABLE] }),
                queryClient.invalidateQueries({ queryKey: [SERVICE, serviceUuid] }),
            ]);
        },
    });
}

export function useRemoveFavourite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (serviceUuid: string) => {
            await api.delete(`/api/favourites/${serviceUuid}`);
        },
        onSuccess: async (_data, serviceUuid) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: [FAVOURITES] }),
                queryClient.invalidateQueries({ queryKey: [SERVICE_TABLE] }),
                queryClient.invalidateQueries({ queryKey: [SERVICE, serviceUuid] }),
            ]);
        },
    });
}
