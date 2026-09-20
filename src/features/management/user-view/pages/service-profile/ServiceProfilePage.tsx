import { useParams } from 'react-router';

import { Role } from '../../../../../models/enums/roles.ts';
import { useService } from '../../../hooks/services-hook.ts';
import { useServiceCategories } from '../../../hooks/service-categories-hook.ts';
import { useCurrentUser } from '../../../hooks/users-hook.ts';

import { ServiceProfile } from './components/ServiceProfile.tsx';
export function ServiceProfilePage() {
    const { serviceUuid } = useParams<{ serviceUuid: string }>();

    const { data: currentUser } = useCurrentUser();
    const { data: service, isLoading, isError } = useService(serviceUuid ?? '');

    const canManageServices =
        (currentUser?.role === Role.MANAGER || currentUser?.role === Role.OWNER) &&
        currentUser?.organizationUuid != null;

    if (!serviceUuid) {
        return <div>Service not found</div>;
    }

    if (isLoading) {
        return <div>Loading service...</div>;
    }

    if (isError || !service) {
        return <div>Failed to load service.</div>;
    }

    return <ServiceProfile service={service} canEdit={canManageServices} />;
}
