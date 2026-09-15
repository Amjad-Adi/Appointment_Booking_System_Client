import { ManagementLayout } from '../../layout/main-management.tsx';
import { organizationSidebarGroups } from '../utils/sidebar.ts';
import { useCurrentUser } from '../../hooks/users-hook.ts';
import { Role } from '../../../../models/enums/roles.ts';
import { roleRecord } from '../../../../models/enums-mapping/roles.ts';

export function OrganizationLayout() {
    const { data } = useCurrentUser();

    return (
        <ManagementLayout
            sidebar={{
                title: roleRecord[Role.OWNER],
                subtitle: 'Management',
                groups: organizationSidebarGroups,
                profile: {
                    name: `${data?.firstName ?? ''} ${data?.lastName ?? ''}`.trim(),
                    email: data?.email ?? '',
                    url: '/organization/profile',
                },
            }}
        />
    );
}
