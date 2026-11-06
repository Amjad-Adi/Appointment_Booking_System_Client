import { ManagementLayout } from '../../layout/main-management.tsx';

import {
    getOrganizationSidebarGroups,
    getOrganizationSetupSidebarGroups,
} from '../utils/sidebar.ts';

import { useCurrentUser } from '../../hooks/users-hook.ts';
import { Role } from '../../../../models/enums/roles.ts';
import { roleRecord } from '../../../../models/enums-mapping/roles.ts';
import { ErrorState } from '../../../../components/ErrorState.tsx';
import { LoadingState } from '../../../../components/LoadingState.tsx';

export function OrganizationLayout() {
    const { data: currentUser, isLoading, isError, error, refetch } = useCurrentUser();

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
                    title="Failed to load your workspace"
                    onRetry={() => refetch()}
                    className="max-w-md"
                />
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-background p-6">
                <ErrorState
                    title="Workspace unavailable"
                    message="Your account could not be loaded. Please sign in again."
                    className="max-w-md"
                />
            </div>
        );
    }

    const organizationUuid = currentUser.organizationUuid;

    const needsSetup = currentUser.role === Role.OWNER && organizationUuid == null;

    const groups = needsSetup
        ? getOrganizationSetupSidebarGroups()
        : organizationUuid
          ? getOrganizationSidebarGroups(organizationUuid, currentUser.role)
          : [];

    return (
        <ManagementLayout
            sidebar={{
                title: roleRecord[currentUser.role],
                subtitle: needsSetup ? 'Organization Setup' : 'Management',
                groups,
                profile: {
                    name: `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim(),
                    email: currentUser.email ?? '',
                    url: '/organization/profile',
                },
            }}
        />
    );
}
