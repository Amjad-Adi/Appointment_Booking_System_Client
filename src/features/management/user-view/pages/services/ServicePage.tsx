import { ManagementPage } from '../../../components/ManagementPage.tsx';
import { ServicesTable } from './tables/ServiceTable.tsx';
import { useCurrentUser } from '../../../hooks/users-hook.ts';

export function ServicesPage() {
    const {data:currentUser}=useCurrentUser()
    return (
        <ManagementPage
            title="Services"
            description={[
                'Manage and monitor organization services, their categories, pricing, and availability.',
            ]}
        >
            <ServicesTable organizationUuid={currentUser?.organizationUuid} />
        </ManagementPage>
    );
}
