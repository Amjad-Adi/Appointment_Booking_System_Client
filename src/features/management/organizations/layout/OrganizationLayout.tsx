import { ManagementLayout } from '../../layout/main-management.tsx';

import {
    getOrganizationSidebarGroups,
    getOrganizationSetupSidebarGroups,
} from '../utils/sidebar.ts';

import { useCurrentUser } from '../../hooks/users-hook.ts';
import { Role } from '../../../../models/enums/roles.ts';
import { roleRecord } from '../../../../models/enums-mapping/roles.ts';

export function OrganizationLayout() {
    const { data: currentUser, isLoading, isError } = useCurrentUser();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f5f5f8] text-xs text-[#777789]">
                Loading workspace...
            </div>
        );
    }

    if (isError || !currentUser) {
        return <div className="p-5 text-sm text-[#c94a5c]">Failed to load your workspace.</div>;
    }

    const organizationUuid = currentUser.organizationUuid;

    const needsSetup = currentUser.role === Role.OWNER && organizationUuid == null;

    const groups = needsSetup
        ? getOrganizationSetupSidebarGroups()
        : organizationUuid
          ? getOrganizationSidebarGroups(organizationUuid)
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
