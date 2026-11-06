import { useParams } from 'react-router';

import { Role } from '../../../../../models/enums/roles.ts';
import { useOrganizationRoom } from '../../../hooks/room-hook.ts';
import { useCurrentUser } from '../../../hooks/users-hook.ts';

import { ErrorState } from '../../../../../components/ErrorState.tsx';
import { LoadingState } from '../../../../../components/LoadingState.tsx';

import { RoomProfile } from './components/RoomProfile.tsx';

export function RoomProfilePage() {
    const { roomUuid } = useParams<{ roomUuid: string }>();

    const { data: currentUser } = useCurrentUser();
    const {
        data: room,
        isLoading,
        isError,
        error,
        refetch,
    } = useOrganizationRoom(currentUser?.organizationUuid, roomUuid);

    const canManageRooms =
        (currentUser?.role === Role.MANAGER || currentUser?.role === Role.OWNER) &&
        currentUser?.organizationUuid != null;

    if (!roomUuid) {
        return (
            <ErrorState title="Room not found" message="The requested room does not exist." />
        );
    }

    if (isLoading) {
        return <LoadingState label="Loading room..." />;
    }

    if (isError) {
        return <ErrorState error={error} title="Failed to load room" onRetry={() => refetch()} />;
    }

    if (!room) {
        return (
            <ErrorState
                title="Room not found"
                message="This room does not exist or is no longer available."
            />
        );
    }

    return <RoomProfile room={room} canEdit={canManageRooms} />;
}
