import { useParams } from 'react-router';

import { useOrganization } from '../hooks/organization-hook.ts';
import { ErrorState } from '../../../components/ErrorState.tsx';
import { LoadingState } from '../../../components/LoadingState.tsx';

export function OrganizationProfile() {
    const { organizationUuid } = useParams();
    const { data, isLoading, isError, error, refetch } = useOrganization(organizationUuid ?? '');

    if (isLoading) {
        return <LoadingState label="Loading organization..." />;
    }

    if (isError) {
        return (
            <ErrorState
                error={error}
                title="Failed to load organization"
                onRetry={() => refetch()}
            />
        );
    }

    if (!data) {
        return (
            <ErrorState
                title="Organization not found"
                message="This organization does not exist or is no longer available."
            />
        );
    }

    return (
        <div>
            <h1>{data.name}</h1>
        </div>
    );
}
