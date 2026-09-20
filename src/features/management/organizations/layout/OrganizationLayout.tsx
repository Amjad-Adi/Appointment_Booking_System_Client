import { ManagementLayout } from '../../layout/main-management.tsx';
import { getOrganizationSidebarGroups } from '../utils/sidebar.ts';
import { useCurrentUser } from '../../hooks/users-hook.ts';
import { Role } from '../../../../models/enums/roles.ts';
import { roleRecord } from '../../../../models/enums-mapping/roles.ts';

export function OrganizationLayout() {
    const { data: currentUser, isLoading } = useCurrentUser();

    const organizationUuid = currentUser?.organizationUuid;

    return (
        <ManagementLayout
            sidebar={{
                title: roleRecord[Role.OWNER],
                subtitle: 'Management',
                groups: organizationUuid ? getOrganizationSidebarGroups(organizationUuid) : [],
                profile: {
                    name: `${currentUser?.firstName ?? ''} ${currentUser?.lastName ?? ''}`.trim(),
                    email: currentUser?.email ?? '',
                    url: '/organization/profile',
                },
            }}
        />
    );
}
