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
    backPath?: string;
    editPath?: string;
    canEdit?: boolean;
}

export function UserProfile({
    user,
    backPath = '/admin/users',
    editPath,
    canEdit,
}: UserProfileProps) {
    const { data } = useCurrentUser();

    const isSelf = data?.uuid === user.uuid;
    const canManageUsers = data?.role === Role.SUPER_ADMIN;
    const canEditProfile = canEdit ?? (isSelf || canManageUsers);

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex min-w-0 items-center justify-between gap-3">
                {backPath ? <BackButton backPath={backPath} /> : <span />}

                {canEditProfile ? (
                    <ProfileActions
                        editPath={editPath ?? `/admin/users/${user.uuid}/edit`}
                    />
                ) : null}
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
