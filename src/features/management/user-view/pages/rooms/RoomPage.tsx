import { ManagementPage } from '../../../components/ManagementPage.tsx';
import { RoomsTable } from './tables/RoomTable.tsx';
import { useCurrentUser } from '../../../hooks/users-hook.ts';

export function RoomPage() {
    const { data: currentUser } = useCurrentUser();
    return (
        <ManagementPage
            title="Rooms"
            description={[
                'Manage and monitor organization rooms, their availability, assigned users, and occupancy.',
            ]}
        >
            <RoomsTable organizationUuid={currentUser?.organizationUuid} />
        </ManagementPage>
    );
}
