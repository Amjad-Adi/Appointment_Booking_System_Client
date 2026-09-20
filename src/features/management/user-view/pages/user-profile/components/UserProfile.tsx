import type { UserResponse } from '../../../../../../models/user.model.ts';

import { UserProfileHeader } from '../../../../components/UserProfileHeader.tsx';
import { UserAboutCard } from '../../../../super-admin-view/pages/users/users-profile/components/UserAboutCard.tsx';
import { UserOrganizationCard } from '../../../../super-admin-view/pages/users/users-profile/components/UserOrganizationCard.tsx';
import { UserAccountCard } from '../../../../super-admin-view/pages/users/users-profile/components/UserAccountCard.tsx';

import { Role } from '../../../../../../models/enums/roles.ts';
import { useCurrentUser } from '../../../../hooks/users-hook.ts';
import { ProfileActions } from '../../../../super-admin-view/pages/components/ProfileActions.tsx';

interface UserProfileProps {
    user: UserResponse;
}

export function UserProfile({ user }: UserProfileProps) {
    const { data } = useCurrentUser();

    const canEdit = data?.role === Role.SUPER_ADMIN;

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-4">
            <ProfileActions editPath="/profile/edit" />

            <UserProfileHeader user={user} />

            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                <UserAboutCard user={user} />

                <UserOrganizationCard organizationUuid={user.organizationUuid} />
            </div>

            <UserAccountCard user={user} />
        </div>
    );
}
