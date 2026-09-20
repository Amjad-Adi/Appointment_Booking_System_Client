import type { ReactNode } from 'react';

import type { RoomResponse } from '../../../../../../models/room.model.ts';

import { Grid } from '../../../../../../components/Grid.tsx';
import { DataViewToolbar } from '../../../../../../components/DataViewToolbar.tsx';

import { RoomCard } from '../components/RoomCard.tsx';

interface RoomsGridProps {
    rooms: RoomResponse[];
    search: string;
    onSearchChange: (value: string) => void;
    filters?: ReactNode;
    actions?: ReactNode;
    canEdit?: boolean;
    onEdit?: (room: RoomResponse) => void;
}

export function RoomsGrid({
    rooms,
    search,
    onSearchChange,
    filters,
    actions,
    canEdit = false,
    onEdit,
}: RoomsGridProps) {
    return (
        <div className="w-full min-w-0">
            <DataViewToolbar
                search={search}
                onSearchChange={onSearchChange}
                filters={filters}
                actions={actions}
            />

            <div className="border-x border-b border-[#dedee8] bg-[#f5f5f8] p-2 sm:p-3">
                <Grid
                    items={rooms}
                    getKey={(room) => room.uuid}
                    emptyTitle="No rooms found"
                    emptyDescription="Try changing your search or filters."
                    renderItem={(room) => (
                        <RoomCard room={room} canEdit={canEdit} onEdit={onEdit} />
                    )}
                />
            </div>
        </div>
    );
}
