import { useParams } from 'react-router';

import { ManagementPage } from '../../../../components/ManagementPage.tsx';
import { ErrorState } from '../../../../../../components/ErrorState.tsx';
import { LoadingState } from '../../../../../../components/LoadingState.tsx';
import { useUser } from '../../../../hooks/users-hook.ts';

import { UserProfile } from './components/UserProfile.tsx';
import { EditUserProfile } from './components/EditUserProfile.tsx';

export function UserProfilePage() {
    const { userUuid, mode } = useParams<{
        userUuid: string;
        mode?: string;
    }>();

    const { data: user, isLoading, isError, error, refetch } = useUser(userUuid ?? '');

    if (isLoading) {
        return (
            <ManagementPage
                title="User Profile"
                description={['View user information and organization details.']}
            >
                <LoadingState label="Loading user profile..." />
            </ManagementPage>
        );
    }

    if (isError) {
        return (
            <ManagementPage
                title="User Profile"
                description={['View user information and organization details.']}
            >
                <ErrorState
                    error={error}
                    title="Failed to load user profile"
                    onRetry={() => refetch()}
                />
            </ManagementPage>
        );
    }

    if (!user) {
        return (
            <ManagementPage
                title="User Profile"
                description={['View user information and organization details.']}
            >
                <ErrorState
                    title="User not found"
                    message="This user does not exist or is no longer available."
                />
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
