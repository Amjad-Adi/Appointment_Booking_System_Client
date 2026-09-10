import { useParams } from 'react-router';

import { ManagementPage } from '../../../components/ManagementPage.tsx';
import { useCurrentUser } from '../../../hooks/users-hook.ts';

import { UserProfile } from '../../../super-admin-view/pages/users/users-profile/components/UserProfile.tsx';
import { EditProfile } from './components/EditProfile.tsx';

export function ProfilePage() {
    const { mode } = useParams<{
        mode?: string;
    }>();

    const { data: user, isLoading, isError } = useCurrentUser();

    if (isLoading) {
        return (
            <ManagementPage
                title="My Profile"
                description={['View and manage your profile information.']}
            >
                <div className="text-[11px] text-[#777789]">Loading profile...</div>
            </ManagementPage>
        );
    }

    if (isError || !user) {
        return (
            <ManagementPage
                title="My Profile"
                description={['View and manage your profile information.']}
            >
                <div className="text-[11px] text-[#c94a5c]">Failed to load profile.</div>
            </ManagementPage>
        );
    }

    return (
        <ManagementPage
            title={mode === 'edit' ? 'Edit Profile' : 'My Profile'}
            description={[
                mode === 'edit'
                    ? 'Update your personal information and account settings.'
                    : 'View and manage your personal information and account details.',
            ]}
        >
            {mode === 'edit' ? <EditProfile user={user} /> : <UserProfile user={user} />}
        </ManagementPage>
    );
}
