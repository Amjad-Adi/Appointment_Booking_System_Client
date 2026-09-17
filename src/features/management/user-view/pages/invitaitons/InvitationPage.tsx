import { ManagementPage } from '../../../components/ManagementPage.tsx';

import { useCurrentUser } from '../../../hooks/users-hook.ts';

import { InvitationsTable } from './tables/InvitationsTable.tsx';

export function InvitationPage() {
    const { data: currentUser } = useCurrentUser();

    return (
        <ManagementPage
            title="Invitations"
            description={['Manage invitations sent to users to join your organization.']}
        >
            <InvitationsTable organizationUuid={currentUser?.organizationUuid} />
        </ManagementPage>
    );
}
