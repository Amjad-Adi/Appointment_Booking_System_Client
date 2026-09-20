import { useMutation, useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { api } from '../../../services/axios.ts';
import type { QueryResponse } from '../../../models/Query/query.model.ts';
import type {
    CreateUser,
    CreateUserByAdmin,
    LoginForm,
    QueryUser,
    RegisterUser,
    UpdateUser,
    UpdateUserByAdmin,
    UserResponse,
} from '../../../models/user.model.ts';
import {
    CURRENT_USER,
    ORGANIZATION,
    ORGANIZATION_TABLE,
    USER,
    USER_TABLE,
} from '../../../utlis/query-keys.ts';
import type { OrganizationResponse } from '../../../models/organization.model.ts';
import { Role } from '../../../models/enums/roles.ts';
import { fireBaseLogIn } from '../../../services/firebase/firebase.ts';
import { firebaseAuth } from '../../../config/firebase.ts';

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
            const idToken = await fireBaseLogIn(firebaseAuth, loginForm.email, loginForm.password);

            const response = await api.post('/api/auth/login', {
                idToken,
            });

            return response.data;
        },

        onSuccess: async (user: UserResponse) => {
            await queryClient.invalidateQueries({
                queryKey: [CURRENT_USER],
            });

            switch (user.role) {
                case Role.SUPER_ADMIN:
                    navigate('/admin', { replace: true });
                    break;

                case Role.OWNER:
                case Role.MANAGER:
                case Role.WORKER:
                case Role.CRM:
                    navigate('/organization', { replace: true });
                    break;

                case Role.CUSTOMER:
                    navigate('/customer', { replace: true });
                    break;

                default:
                    navigate('/login', { replace: true });
            }
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
        onSuccess: async (user: UserResponse) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [USER_TABLE],
                }),
                queryClient.invalidateQueries({
                    queryKey: [USER, user.uuid],
                }),
            ]);
        },
        onError: (error) => {
            console.log(error);
        },
    });
}

export function useUpdateCurrentUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user: UpdateUser) => {
            const response = await api.patch(`/api/users/me`, user);
            return response.data;
        },
        onSuccess: async (user: UserResponse) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [CURRENT_USER],
                }),
                queryClient.invalidateQueries({
                    queryKey: [USER, user.uuid],
                }),
            ]);
        },
        onError: (error) => {
            console.log(error);
        },
    });
}

export function useRegisterUser() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (userForm: CreateUser) => {
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

export function useUser(userUuid: string) {
    return useQuery({
        queryKey: [USER, userUuid],
        queryFn: async (): Promise<UserResponse> => {
            const response = await api.get<UserResponse>(`/api/users/${userUuid}`);
            return response.data;
        },
    });
}

export function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const response = await api.post('api/auth/logout');
            return response.data;
        },
        onSuccess: async () => {
            queryClient.removeQueries({ queryKey: [CURRENT_USER] });
            navigate('/login');
        },
        onError: (error) => {
            console.log(error);
        },
    });
}

export function useCreateUserByAdmin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userForm: CreateUserByAdmin) => {
            const response = await api.post('api/users/', userForm);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [USER_TABLE] });
        },
        onError: (error) => {
            console.log(error);
        },
    });
}
