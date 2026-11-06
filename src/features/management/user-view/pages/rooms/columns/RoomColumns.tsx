import type { RoomResponse } from '../../../../../../models/room.model.ts';
import type { DataTableColumn } from '../../../../../../components/DataTableFeatures.ts';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../../../../../components/DropdownMenu.tsx';

import { BedDouble, Info, MoreHorizontalIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../../../../../../../@/components/ui/Tooltip.tsx';

import { Button } from '../../../../../../components/Button.tsx';
import { EntityImage } from '../../../../../../components/EntityImage.tsx';
import { ActivationStatusRender } from '../../../../components/ActivationStatusRender.tsx';
import { roomOccupancyStatusRecord } from '../../../../../../models/enums-mapping/room-occupancy-status.ts';

export const ROOM_TABLE_COLUMN = {
    NAME: 'name',
    OCCUPANCY_STATUS: 'occupancyStatus',
    ASSIGNED_USER: 'assignedUser',
    STATUS: 'status',
    CREATED_AT_UTC: 'createdAtUTC',
    ACTIONS: 'actions',
} as const;

export const ROOM_TABLE_HEADER = {
    NAME: 'Room',
    OCCUPANCY_STATUS: 'Occupancy Status',
    ASSIGNED_USER: 'Assigned User',
    STATUS: 'Status',
    CREATED_AT_UTC: 'Created At',
    ACTIONS: 'Actions',
} as const;

export function getRoomColumns(
    onEdit?: (room: RoomResponse) => void,
): DataTableColumn<RoomResponse>[] {
    return [
        {
            accessorKey: ROOM_TABLE_COLUMN.NAME,
            header: ROOM_TABLE_HEADER.NAME,
            cell: ({ row }) => <RoomName room={row.original} />,
        },
        {
            accessorKey: ROOM_TABLE_COLUMN.OCCUPANCY_STATUS,
            header: ROOM_TABLE_HEADER.OCCUPANCY_STATUS,
            enableSorting: false,
            cell: ({ row }) => (
                <span className="whitespace-nowrap">
                    {roomOccupancyStatusRecord[row.original.occupancyStatus]}
                </span>
            ),
        },
        {
            id: ROOM_TABLE_COLUMN.ASSIGNED_USER,
            header: ROOM_TABLE_HEADER.ASSIGNED_USER,
            enableSorting: false,
            cell: ({ row }) => <AssignedUserName room={row.original} />,
        },
        {
            accessorKey: ROOM_TABLE_COLUMN.STATUS,
            header: ROOM_TABLE_HEADER.STATUS,
            enableSorting: false,
            cell: ({ row }) => <ActivationStatusRender status={row.original.status} />,
        },
        {
            accessorKey: ROOM_TABLE_COLUMN.CREATED_AT_UTC,
            header: ROOM_TABLE_HEADER.CREATED_AT_UTC,
            cell: ({ row }) => (
                <span className="whitespace-nowrap">
                    {new Date(row.original.createdAtUTC).toLocaleDateString()}
                </span>
            ),
        },
        {
            id: ROOM_TABLE_COLUMN.ACTIONS,
            header: ROOM_TABLE_HEADER.ACTIONS,
            enableSorting: false,
            cell: ({ row }) => <RoomActions room={row.original} onEdit={onEdit} />,
        },
    ];
}

function RoomName({ room }: { room: RoomResponse }) {
    const hasDescription = Boolean(room.description?.trim());

    return (
        <div className="flex min-w-0 items-center gap-2">
            <EntityImage
                src={room.profilePicturePath}
                alt={room.name}
                icon={BedDouble}
                className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-secondary text-muted-foreground"
                iconClassName="size-4"
            />

            {hasDescription ? (
                <Tooltip>
                    <div className="flex w-full max-w-48 items-center justify-between gap-1">
                        <span className="min-w-0 truncate">{room.name}</span>

                        <TooltipTrigger
                            render={
                                <span className="shrink-0 cursor-default">
                                    <Info className="size-3.5" />
                                </span>
                            }
                        />
                    </div>

                    <TooltipContent
                        side="top"
                        align="center"
                        className="max-w-xs text-[11px] leading-4 whitespace-normal"
                    >
                        {room.description}
                    </TooltipContent>
                </Tooltip>
            ) : (
                <span className="block max-w-48 truncate">{room.name}</span>
            )}
        </div>
    );
}

function AssignedUserName({ room }: { room: RoomResponse }) {
    const assignedUserName = room.userUuid
        ? [room.firstName, room.lastName].filter(Boolean).join(' ')
        : '';

    return <span className="block max-w-40 truncate">{assignedUserName || 'Unassigned'}</span>;
}

function RoomActions({
    room,
    onEdit,
}: {
    room: RoomResponse;
    onEdit?: (room: RoomResponse) => void;
}) {
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <div className="group">
                <DropdownMenuTrigger
                    render={
                        <Button
                            type="button"
                            className="size-6 min-h-0 min-w-0 !border-transparent !bg-transparent p-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 hover:!bg-transparent sm:h-6 sm:w-6 sm:px-0 md:h-6 md:w-6"
                            aria-label={`Actions for ${room.name}`}
                        >
                            <MoreHorizontalIcon className="size-4 shrink-0" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    }
                />
            </div>

            <DropdownMenuContent className="flex flex-col justify-end p-1">
                {onEdit && (
                    <DropdownMenuItem className="h-7 px-2 text-[11px]" onClick={() => onEdit(room)}>
                        Edit
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem
                    className="h-7 px-2 text-[11px]"
                    onClick={() => navigate(`${room.uuid}`)}
                >
                    View Room
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
