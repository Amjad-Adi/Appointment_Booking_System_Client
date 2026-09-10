import { ManagementLayout } from '../../layout/main-management.tsx';
import { adminSidebarGroups } from '../utils/sidebar.ts';
import { Image } from '../../../../components/Image.tsx';
import icon from '../../../../assets/images/icons/icon.png';
import { useCurrentUser, useLogout } from '../../hooks/users-hook.ts';
import toast from 'react-hot-toast';
import { Toast } from '../../../../utlis/toast.ts';

export function UserLayout() {
    const { data, isLoading, isError } = useCurrentUser();
    return (
        <ManagementLayout
            sidebar={{
                title: 'Super Admin',
                subtitle: 'Management',
                groups: adminSidebarGroups,
                profile: {
                    name: `${data?.firstName} ${data?.lastName}`,
                    email: `${data?.email}`,
                    url: `users/${data?.uuid}`,
                },
            }}
        />
    );
}
