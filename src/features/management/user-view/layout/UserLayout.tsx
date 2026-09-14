import { ManagementLayout } from '../../layout/main-management.tsx';
import { userSidebarGroups } from '../utils/sidebar.ts';
import { useCurrentUser } from '../../hooks/users-hook.ts';

export function UserLayout() {
    const { data } = useCurrentUser();

    return (
        <ManagementLayout
            sidebar={{
                title: '',
                subtitle: 'Management',
                groups: userSidebarGroups,
                profile: {
                    name: `${data?.firstName} ${data?.lastName}`,
                    email: `${data?.email}`,
                    url: `/user/profile`,
                },
            }}
        />
    );
}
