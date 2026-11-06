import { useMutation, useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { api } from '../../../services/axios.ts';
import type { QueryResponse } from '../../../models/Query/query.model.ts';
import type {
    CreateUser,
    CreateUserByAdmin,
    LoginForm,
    OrganizationCustomer,
    QueryOrganizationCustomer,
    QueryUser,
    RegisterUser,
    UpdateUser,
    UpdateUserByAdmin,
    UserResponse,
} from '../../../models/user.model.ts';
import {
    CURRENT_USER,
    ORGANIZATION,
    ORGANIZATION_CUSTOMERS,
    ORGANIZATION_TABLE,
    USER,
    USER_TABLE,
} from '../../../utlis/query-keys.ts';
import { Role } from '../../../models/enums/roles.ts';
import { fireBaseLogIn } from '../../../services/firebase/firebase.ts';
import { firebaseAuth } from '../../../config/firebase.ts';
import { toFormData } from '../../../utlis/form-data.ts';
import { useDebouncedQuery } from '../../../hooks/deounce.ts';

export function useUsers(query: QueryUser, enabled = true) {
    const debouncedQuery = useDebouncedQuery(query);

    return useQuery({
        queryKey: [USER_TABLE, debouncedQuery],
        queryFn: async (): Promise<QueryResponse<UserResponse>> => {
            const response = await api.get<QueryResponse<UserResponse>>('/api/users', {
                params: debouncedQuery,
            });
            return response.data;
        },
        enabled,
        placeholderData: keepPreviousData,
    });
}

const DEFAULT_CUSTOMER_QUERY: QueryOrganizationCustomer = {
    page: 1,
    limit: 100,
};

export function useOrganizationCustomers(
    organizationUuid: string | undefined,
    query: QueryOrganizationCustomer = DEFAULT_CUSTOMER_QUERY,
    enabled = true,
) {
    const debouncedQuery = useDebouncedQuery(query);

    return useQuery({
        queryKey: [ORGANIZATION_CUSTOMERS, organizationUuid, debouncedQuery],
        queryFn: async (): Promise<QueryResponse<OrganizationCustomer>> => {
            const response = await api.get<QueryResponse<OrganizationCustomer>>(
                `/api/organizations/${organizationUuid}/customers`,
                { params: debouncedQuery },
            );
            return response.data;
        },
        enabled: enabled && !!organizationUuid,
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
            const { uuid, profilePicture, ...userData } = user;
            const formData = toFormData(userData);

            if (profilePicture instanceof File) {
                formData.append('profilePicturePath', profilePicture);
            }

            const response = await api.patch(`/api/users/${uuid}`, formData);
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
    });
}

export function useUpdateCurrentUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (
            user: Omit<UpdateUser, 'uuid'> & { profilePicture?: File | null },
        ) => {
            const { profilePicture, ...userData } = user;
            const formData = toFormData(userData);

            if (profilePicture instanceof File) {
                formData.append('profilePicturePath', profilePicture);
            }

            const response = await api.patch(`/api/users/me`, formData);
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
    });
}

export function useUpdateCurrentUserPassword() {
    return useMutation({
        mutationFn: async (passwords: { password: string; confirmPassword: string }) => {
            const response = await api.patch(`/api/users/me/password`, passwords);
            return response.data;
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
    });
}

export function useCreateUserByAdmin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userForm: CreateUserByAdmin) => {
            const { profilePicture, ...userData } = userForm;
            const formData = toFormData(userData);

            if (profilePicture instanceof File) {
                formData.append('profilePicturePath', profilePicture);
            }

            const response = await api.post('api/users/', formData);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [USER_TABLE] });
        },
    });
}
