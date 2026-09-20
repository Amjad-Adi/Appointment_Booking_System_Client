import { useLocation, useNavigate, useParams } from 'react-router';

import { ManagementPage } from '../../../../components/ManagementPage.tsx';
import { useCurrentUser } from '../../../../hooks/users-hook.ts';
import { useOrganization } from '../../../../hooks/organization-hook.ts';

import { Role } from '../../../../../../models/enums/roles.ts';

import { OrganizationProfile } from './components/OrganizationProfile.tsx';
import { EditOrganizationProfile } from './components/EditOrganizationProfile.tsx';

export function OrganizationProfilePage() {
    const navigate = useNavigate();
    const location = useLocation();

    const { organizationUuid, mode } = useParams<{
        organizationUuid: string;
        mode?: string;
    }>();

    const { data: currentUser } = useCurrentUser();
    const { data: organization, isLoading, isError } = useOrganization(organizationUuid ?? '');

    const role = currentUser?.role;

    const isSuperAdmin = role === Role.SUPER_ADMIN;
    const isCustomer = role === Role.CUSTOMER;
    const isOrgStaff = role === Role.OWNER || role === Role.MANAGER || role === Role.CRM;

    // Bulletproof Path Resolution: Strip `/edit` from current path if present
    const basePath = location.pathname.replace(/\/edit$/, '');
    const parentListPath = location.pathname.startsWith('/admin')
        ? '/admin/organizations'
        : '/organization';

    // Back button should NOT show for organization staff managing their own profile
    const canShowBackButton = isSuperAdmin && !isOrgStaff;

    // Edit Permissions
    const canEdit = !isCustomer && (isSuperAdmin || isOrgStaff);
    const canEditStatus = isSuperAdmin;
    const canEditDetails = isOrgStaff;
    const canEditWorkingHours = isOrgStaff;

    const handleOpenEdit = () => {
        if (!organizationUuid || !canEdit) return;
        navigate(`${basePath}/edit`);
    };

    const handleCloseEdit = () => {
        if (!organizationUuid) return;
        navigate(basePath);
    };

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

    const isEditMode = mode === 'edit' && canEdit;

    return (
        <ManagementPage
            title={isEditMode ? 'Edit Organization' : 'Organization Profile'}
            description={[
                isEditMode
                    ? 'Update organization information and account settings.'
                    : 'View organization information and details.',
            ]}
        >
            {isEditMode ? (
                <EditOrganizationProfile
                    organization={organization}
                    canEditStatus={canEditStatus}
                    canEditDetails={canEditDetails}
                    onClose={handleCloseEdit}
                />
            ) : (
                <OrganizationProfile
                    organization={organization}
                    backPath={canShowBackButton ? parentListPath : undefined}
                    canEdit={canEdit}
                    canEditWorkingHours={canEditWorkingHours}
                    onEdit={handleOpenEdit}
                />
            )}
        </ManagementPage>
    );
}
