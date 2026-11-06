import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

import { ManagementPage } from '../../../../components/ManagementPage.tsx';
import { ErrorState } from '../../../../../../components/ErrorState.tsx';
import { LoadingState } from '../../../../../../components/LoadingState.tsx';
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
    const {
        data: organization,
        isLoading,
        isError,
        error,
        refetch,
    } = useOrganization(organizationUuid ?? '');

    const role = currentUser?.role;

    useEffect(() => {
        if (isLoading || !location.hash) {
            return;
        }

        document
            .getElementById(location.hash.slice(1))
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [isLoading, location.hash]);

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
    // The edit screen only changes organization details/status, which the server
    // allows for SUPER_ADMIN (admin schema) and OWNER (organization schema).
    const canEdit = isSuperAdmin || role === Role.OWNER;
    const canEditStatus = isSuperAdmin;
    // Server grants UPDATE_ORGANIZATION to OWNER only; managers/CRMs can still edit working hours.
    const canEditDetails = role === Role.OWNER;
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
                <LoadingState label="Loading organization profile..." />
            </ManagementPage>
        );
    }

    if (isError) {
        return (
            <ManagementPage
                title="Organization Profile"
                description={['View organization information and details.']}
            >
                <ErrorState
                    error={error}
                    title="Failed to load organization profile"
                    onRetry={() => refetch()}
                />
            </ManagementPage>
        );
    }

    if (!organization) {
        return (
            <ManagementPage
                title="Organization Profile"
                description={['View organization information and details.']}
            >
                <ErrorState
                    title="Organization not found"
                    message="This organization does not exist or is no longer available."
                />
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
