import { ManagementPage } from '../../../components/ManagementPage.tsx';
import { OrganizationsTable } from './tables/OrganizationsTable.tsx';

export function SuperAdminOrganizationsPage() {
    return (
        <ManagementPage
            title="Organizations"
            description={['Manage and monitor organizations, their details, and account status.']}
        >
            <OrganizationsTable />
        </ManagementPage>
    );
}