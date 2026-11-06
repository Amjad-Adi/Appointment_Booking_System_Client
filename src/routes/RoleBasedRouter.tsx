import { Navigate } from 'react-router';

import { rolesPermissions } from '../permissions/roles-permissions.ts';
import { useCurrentUser } from '../features/management/hooks/users-hook.ts';
import { Role } from '../models/enums/roles.ts';
import { ErrorState } from '../components/ErrorState.tsx';
import { LoadingState } from '../components/LoadingState.tsx';

type RoleBasedRouterProps = {
    children: React.ReactElement;
    permission: string;
};

const roleHome: Record<Role, string> = {
    [Role.SUPER_ADMIN]: '/admin',
    [Role.OWNER]: '/organization',
    [Role.MANAGER]: '/organization',
    [Role.CRM]: '/organization',
    [Role.WORKER]: '/organization',
    [Role.CUSTOMER]: '/customer',
};

export function RoleBasedRouter({ children, permission }: RoleBasedRouterProps) {
    const { data: user, isLoading, isError, error, refetch } = useCurrentUser();

    if (isLoading) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-background p-6">
                <LoadingState label="Loading your workspace..." className="max-w-md" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-background p-6">
                <ErrorState
                    error={error}
                    title="Failed to load your account"
                    message={
                        'We could not verify your session. Check your connection and try again.'
                    }
                    onRetry={() => refetch()}
                    className="max-w-md"
                />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (!rolesPermissions[user.role]?.includes(permission)) {
        return <Navigate to={roleHome[user.role] ?? '/login'} replace />;
    }
    return children;
}
