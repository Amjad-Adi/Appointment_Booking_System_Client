import { ManagementLayout } from '../../layout/main-management.tsx';
import { adminSidebarGroups } from '../utils/sidebar.ts';
import { Image } from '../../../../components/Image.tsx';
import icon from '../../../../assets/images/icons/icon.png';
import { useCurrentUser, useLogout } from '../../hooks/users-hook.ts';
import toast from 'react-hot-toast';
import { Toast } from '../../../../utlis/toast.ts';
import { Role } from '../../../../models/enums/roles.ts';
import { roleRecord } from '../../../../models/enums-mapping/roles.ts';
import { getOrganizationSidebarGroups } from '../../organizations/utils/sidebar.ts';

export function SuperAdminLayout() {
    const { data:currentUser, isLoading, isError } = useCurrentUser();
    return (
        <ManagementLayout
            sidebar={{
                title: roleRecord[Role.OWNER],
                subtitle: 'Management',
                groups: getOrganizationSidebarGroups(currentUser?.organizationUuid as string),
                profile: {
                    name: `${currentUser?.firstName} ${currentUser?.lastName}`,
                    email: `${currentUser?.email}`,
                    url: `users/${currentUser?.uuid}`,
                },
            }}
        />
    );
}
