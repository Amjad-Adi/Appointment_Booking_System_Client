import { ManagementPage } from '../../../components/ManagementPage.tsx';
import { ServicesView } from './tables/ServiceTable.tsx';
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
            <ServicesView organizationUuid={currentUser?.organizationUuid} />
        </ManagementPage>
    );
}
