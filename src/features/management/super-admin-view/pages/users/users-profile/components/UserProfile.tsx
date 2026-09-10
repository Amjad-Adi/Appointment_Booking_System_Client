import type { UserResponse } from '../../../../../../../models/user.model.ts';

import { UserProfileHeader } from '../../../../../components/UserProfileHeader.tsx';
import { UserAboutCard } from './UserAboutCard.tsx';
import { UserOrganizationCard } from './UserOrganizationCard.tsx';
import { UserAccountCard } from './UserAccountCard.tsx';

import { Role } from '../../../../../../../models/enums/roles.ts';
import { useCurrentUser } from '../../../../../hooks/users-hook.ts';

import { ProfileActions } from '../../../components/ProfileActions.tsx';
import { BackButton } from '../../../../../components/BackButton.tsx';

interface UserProfileProps {
    user: UserResponse;
    editPath?: string;
}

export function UserProfile({ user, editPath }: UserProfileProps) {
    const { data } = useCurrentUser();

    const canEdit = data?.role === Role.SUPER_ADMIN;

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex min-w-0 items-center justify-between gap-3">
                <BackButton backPath="/admin/users" />

                <ProfileActions editPath={`/admin/users/${user.uuid}/edit`} />
            </div>

            <UserProfileHeader user={user} />

            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                <UserAboutCard user={user} />

                <UserOrganizationCard organizationUuid={user.organizationUuid} />
            </div>

            <UserAccountCard user={user} />
        </div>
    );
}
