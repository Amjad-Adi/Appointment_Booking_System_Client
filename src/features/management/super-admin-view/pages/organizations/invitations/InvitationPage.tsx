import { ManagementPage } from '../../../../components/ManagementPage.tsx';

import { useCurrentUser } from '../../../../hooks/users-hook.ts';
import { OrganizationInvitationsTable } from './table/OrganizationInvitationsTable.tsx';


export function InvitationPage() {
    const { data: currentUser } = useCurrentUser();

    return (
        <ManagementPage
            title="Invitations"
            description={['Manage invitations sent to users to join your organization.']}
        >
            <OrganizationInvitationsTable organizationUuid={currentUser?.organizationUuid as string} />
        </ManagementPage>
    );
}
