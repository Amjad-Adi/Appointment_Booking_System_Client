import { ManagementLayout } from '../../layout/main-management.tsx';
import { adminSidebarGroups } from '../utils/sidebar.ts';
import { useCurrentUser } from '../../hooks/users-hook.ts';
import { Role } from '../../../../models/enums/roles.ts';
import { roleRecord } from '../../../../models/enums-mapping/roles.ts';

export function SuperAdminLayout() {
    const { data: currentUser } = useCurrentUser();

    return (
        <ManagementLayout
            sidebar={{
                title: roleRecord[Role.SUPER_ADMIN],
                subtitle: 'Management',
                groups: adminSidebarGroups,
                profile: {
                    name: `${currentUser?.firstName ?? ''} ${currentUser?.lastName ?? ''}`.trim(),
                    email: currentUser?.email ?? '',
                    url: '/admin/profile',
                },
            }}
        />
    );
}
