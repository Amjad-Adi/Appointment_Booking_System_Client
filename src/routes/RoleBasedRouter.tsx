import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER } from '../utlis/query-keys.ts';
import type { UserResponse } from '../models/user.model.ts';
import { rolesPermissions } from '../permissions/roles-permissions.ts';
import { Navigate } from 'react-router';
import { Route } from 'lucide-react';
import { useCurrentUser } from '../features/management/hooks/users/users-hook.ts';
type RoleBasedRouterProps = {
    children: React.ReactElement;
    permission: string;
};

export function RoleBasedRouter({ children, permission }: RoleBasedRouterProps) {
    const { data: user, isLoading, isError } = useCurrentUser();
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError || !user) {
        return <Navigate to="/login" replace />;
    }
    if (!rolesPermissions[user.role]?.includes(permission)) {
        return <Navigate to="/forbidden" replace />;
    }
    return children;
}
