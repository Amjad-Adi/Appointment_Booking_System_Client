
import { ManagementPage } from '../../../../../../components/ManagementPage.tsx';
import { CreateOrganizationForm } from './CreateOrganizationForm.tsx';

export function CreateOrganizationPage() {
    return (
        <ManagementPage
            title="Create Organization"
            description={[
                'Create a new organization and configure its basic information and location.',
            ]}
        >
            <CreateOrganizationForm />
        </ManagementPage>
    );
}