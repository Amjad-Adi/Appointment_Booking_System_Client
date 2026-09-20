import { useParams } from 'react-router';

import { ManagementPage } from '../../../../components/ManagementPage.tsx';
import { useUser } from '../../../../hooks/users-hook.ts';

import { UserProfile } from './components/UserProfile.tsx';
import { EditUserProfile } from './components/EditUserProfile.tsx';

export function UserProfilePage() {
    const { userUuid, mode } = useParams<{
        userUuid: string;
        mode?: string;
    }>();

    const { data: user, isLoading, isError } = useUser(userUuid ?? '');

    if (isLoading) {
        return (
            <ManagementPage
                title="User Profile"
                description={['View user information and organization details.']}
            >
                <div className="text-[11px] text-[#777789]">Loading user profile...</div>
            </ManagementPage>
        );
    }

    if (isError || !user) {
        return (
            <ManagementPage
                title="User Profile"
                description={['View user information and organization details.']}
            >
                <div className="text-[11px] text-[#c94a5c]">Failed to load user profile.</div>
            </ManagementPage>
        );
    }

    return (
        <ManagementPage
            title={mode === 'edit' ? 'Edit User' : 'User Profile'}
            description={[
                mode === 'edit'
                    ? 'Update user information and account settings.'
                    : 'View user information and organization details.',
            ]}
        >
            {mode === 'edit' ? <EditUserProfile user={user} /> : <UserProfile user={user} />}
        </ManagementPage>
    );
}
