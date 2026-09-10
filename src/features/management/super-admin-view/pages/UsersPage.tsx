import { ManagementPage } from '../../components/ManagementPage.tsx';

import { UsersTable } from './users/tables/UsersTable.tsx';

export function SuperAdminUsersPage(){
    return (
        <ManagementPage
            title="System Users"
            description={['Manage and monitor system users, their roles, and account status.']}
        >
            <UsersTable />
        </ManagementPage>
    );
}
