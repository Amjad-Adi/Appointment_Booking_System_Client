import { api } from '../../../../services/axios.ts';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { queryUserSchema } from '../../../../zod-schemas/user.schema.ts';
import { z } from 'zod';
import type { QueryResponse } from '../../../../models/Query/query.model.ts';
import type { UserResponse } from '../../../../models/user.model.ts';

export type UserQuery = z.infer<typeof queryUserSchema>;

export function useUsers(query: UserQuery) {
    return useQuery({
        queryKey: ['users', query],
        queryFn: async (): Promise<QueryResponse<UserResponse>> => {
            const response = await api.get<QueryResponse<UserResponse>>('/api/users', {
                params: query,
            });

            return response.data;
        },
        placeholderData: keepPreviousData,
    });
}
