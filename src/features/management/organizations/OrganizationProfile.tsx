import { useParams } from 'react-router';
import { useOrganization } from '../hooks/orgsnization-hook.ts';
import { Skeleton } from '../../../components/Skeleton.tsx';

export function OrganizationProfile() {
    const { organizationUuid } = useParams();
    const { data, isLoading, isError } = useOrganization(organizationUuid!);
    if (isLoading) {
        return <div>Loading organization...</div>;
    }
    if (isError || !data) {
        return <div>Failed to load organization.</div>;
    }
    return (
        <div>
            <h1>{data.name}</h1>
            <Skeleton className="h-10 w-40 rounded-full" />
        </div>
    );
}
