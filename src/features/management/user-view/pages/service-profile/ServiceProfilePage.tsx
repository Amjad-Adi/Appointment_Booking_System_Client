import { useParams } from 'react-router';

import { Role } from '../../../../../models/enums/roles.ts';
import { useOrganizationService, useService } from '../../../hooks/services-hook.ts';
import { useCurrentUser } from '../../../hooks/users-hook.ts';

import { ErrorState } from '../../../../../components/ErrorState.tsx';
import { LoadingState } from '../../../../../components/LoadingState.tsx';

import { ServiceProfile } from './components/ServiceProfile.tsx';
export function ServiceProfilePage() {
    const { serviceUuid } = useParams<{ serviceUuid: string }>();

    const { data: currentUser } = useCurrentUser();

    const organizationUuid = currentUser?.organizationUuid;

    const publicService = useService(serviceUuid ?? '', !organizationUuid);

    const organizationService = useOrganizationService(organizationUuid, serviceUuid);

    const { data: service, isLoading, isError, error, refetch } = organizationUuid
        ? organizationService
        : publicService;

    const canManageServices =
        (currentUser?.role === Role.MANAGER || currentUser?.role === Role.OWNER) &&
        currentUser?.organizationUuid != null;

    if (!serviceUuid) {
        return (
            <ErrorState
                title="Service not found"
                message="The requested service does not exist."
            />
        );
    }

    if (isLoading) {
        return <LoadingState label="Loading service..." />;
    }

    if (isError) {
        return (
            <ErrorState error={error} title="Failed to load service" onRetry={() => refetch()} />
        );
    }

    if (!service) {
        return (
            <ErrorState
                title="Service not found"
                message="This service does not exist or is no longer available."
            />
        );
    }

    return <ServiceProfile service={service} canEdit={canManageServices} />;
}
