import { useLocation, useParams } from 'react-router';

import { ManagementPage } from '../../../components/ManagementPage.tsx';
import { ErrorState } from '../../../../../components/ErrorState.tsx';
import { LoadingState } from '../../../../../components/LoadingState.tsx';
import { useCurrentUser } from '../../../hooks/users-hook.ts';

import { UserProfile } from '../../../super-admin-view/pages/users/users-profile/components/UserProfile.tsx';
import { EditProfile } from './components/EditProfile.tsx';

export function ProfilePage() {
    const { mode } = useParams<{
        mode?: string;
    }>();

    const { pathname } = useLocation();
    const basePath = pathname.replace(/\/edit$/, '');

    const { data: user, isLoading, isError, error, refetch } = useCurrentUser();

    if (isLoading) {
        return (
            <ManagementPage
                title="My Profile"
                description={['View and manage your profile information.']}
            >
                <LoadingState label="Loading profile..." />
            </ManagementPage>
        );
    }

    if (isError) {
        return (
            <ManagementPage
                title="My Profile"
                description={['View and manage your profile information.']}
            >
                <ErrorState
                    error={error}
                    title="Failed to load profile"
                    onRetry={() => refetch()}
                />
            </ManagementPage>
        );
    }

    if (!user) {
        return (
            <ManagementPage
                title="My Profile"
                description={['View and manage your profile information.']}
            >
                <ErrorState
                    title="Profile not found"
                    message="Your profile could not be loaded. Please sign in again."
                />
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
            {mode === 'edit' ? (
                <EditProfile user={user} />
            ) : (
                <UserProfile
                    user={user}
                    backPath=""
                    editPath={`${basePath}/edit`}
                    canEdit
                />
            )}
        </ManagementPage>
    );
}
