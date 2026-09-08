import { useParams } from 'react-router';
import { useOrganization } from '../hooks/orgsnization-hook.ts';
import { useUser, useUsers } from '../hooks/users-hook.ts';

export function UserProfile() {
    const { userUuid } = useParams();
    const { data, isLoading, isError } = useUser(userUuid!);
    if (isLoading) {
        return <div>Loading organization...</div>;
    }
    if (isError || !data) {
        return <div>Failed to load organization.</div>;
    }
    return (
        <div>
            <h1>{data.email}</h1>
        </div>
    );
}
