import { useParams } from 'react-router';

import { Role } from '../../../../../models/enums/roles.ts';
import { useRoom } from '../../../hooks/room-hook.ts';
import { useCurrentUser } from '../../../hooks/users-hook.ts';

import { RoomProfile } from './components/RoomProfile.tsx';

export function RoomProfilePage() {
    const { roomUuid } = useParams<{ roomUuid: string }>();

    const { data: currentUser } = useCurrentUser();
    const { data: room, isLoading, isError } = useRoom(roomUuid ?? '');

    const canManageRooms =
        (currentUser?.role === Role.MANAGER || currentUser?.role === Role.OWNER) &&
        currentUser?.organizationUuid != null;

    if (!roomUuid) {
        return <div>Room not found</div>;
    }

    if (isLoading) {
        return <div>Loading room...</div>;
    }

    if (isError || !room) {
        return <div>Failed to load room.</div>;
    }

    return <RoomProfile room={room} canEdit={canManageRooms} />;
}
