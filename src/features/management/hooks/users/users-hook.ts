import { useMutation, useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { api } from '../../../../services/axios.ts';
import type { QueryResponse } from '../../../../models/Query/query.model.ts';
import type {
    CreateUser,
    LoginForm,
    QueryUser,
    RegisterUser,
    UpdateUser,
    UpdateUserByAdmin,
    UserResponse,
} from '../../../../models/user.model.ts';
import { CURRENT_USER, USER_TABLE } from '../../../../utlis/query-keys.ts';

export function useUsers(query: QueryUser) {
    return useQuery({
        queryKey: [USER_TABLE, query],
        queryFn: async (): Promise<QueryResponse<UserResponse>> => {
            const response = await api.get<QueryResponse<UserResponse>>('/api/users', {
                params: query,
            });
            return response.data;
        },
        placeholderData: keepPreviousData,
    });
}

export function useLogin() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (loginForm: LoginForm) => {
            const response = await api.post('/api/auth/login', loginForm);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [CURRENT_USER],
            });
            navigate('/admin/users');
        },
        onError: (error) => {
            console.log(error);
        },
    });
}

export function useCurrentUser() {
    return useQuery({
        queryKey: [CURRENT_USER],
        queryFn: async (): Promise<UserResponse> => {
            const response = await api.get<UserResponse>('/api/users/me');
            return response.data;
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user: UpdateUserByAdmin) => {
            const { uuid, ...userData } = user;
            const response = await api.patch(`/api/users/${uuid}`, userData);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [USER_TABLE],
            });
        },
        onError: (error) => {
            console.log(error);
        },
    });
}

export function useRegisterUser() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (userForm: RegisterUser) => {
            const response = await api.post('api/users/register', userForm);
            return response.data;
        },
        onSuccess: async () => {
            navigate('/login');
        },
        onError: (error) => {
            console.log(error);
        },
    });
}
