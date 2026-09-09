import { ManagementPage } from '../../components/ManagementPage.tsx';

import { UsersTable } from './components/tables/UserTable.tsx';

export function User() {
    return (
        <ManagementPage
            title="System Users"
            description={['Manage and monitor system users, their roles, and account status.']}
        >
            <UsersTable />
        </ManagementPage>
    );
}
