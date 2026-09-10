import { useParams } from 'react-router';

import { ManagementPage } from '../../../../components/ManagementPage.tsx';
import { useOrganization } from '../../../../hooks/orgsnization-hook.ts';

import { OrganizationProfile } from './components/OrganizationProfile.tsx';
import { EditOrganizationProfile } from './components/EditOrganizationProfile.tsx';

export function OrganizationProfilePage() {
    const { organizationUuid, mode } = useParams<{
        organizationUuid: string;
        mode?: string;
    }>();

    const { data: organization, isLoading, isError } = useOrganization(organizationUuid ?? '');

    if (isLoading) {
        return (
            <ManagementPage
                title="Organization Profile"
                description={['View organization information and details.']}
            >
                <div className="text-[11px] text-[#777789]">Loading organization profile...</div>
            </ManagementPage>
        );
    }

    if (isError || !organization) {
        return (
            <ManagementPage
                title="Organization Profile"
                description={['View organization information and details.']}
            >
                <div className="text-[11px] text-[#c94a5c]">
                    Failed to load organization profile.
                </div>
            </ManagementPage>
        );
    }

    return (
        <ManagementPage
            title={mode === 'edit' ? 'Edit Organization' : 'Organization Profile'}
            description={[
                mode === 'edit'
                    ? 'Update organization information and account settings.'
                    : 'View organization information and details.',
            ]}
        >
            {mode === 'edit' ? (
                <EditOrganizationProfile organization={organization} />
            ) : (
                <OrganizationProfile organization={organization} />
            )}
        </ManagementPage>
    );
}
