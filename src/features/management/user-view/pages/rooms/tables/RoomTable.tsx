import { useState } from 'react';
import { type PaginationState, type SortingState } from '@tanstack/react-table';

import { Plus } from 'lucide-react';

import { DataTable } from '../../../../../../components/DataTable.tsx';
import { ErrorState } from '../../../../../../components/ErrorState.tsx';
import { PAGE_SIZE } from '../../../../../../components/DataTableFeatures.ts';
import { Select } from '../../../../../../components/Select.tsx';
import { Button } from '../../../../../../components/Button.tsx';

import { Order } from '../../../../../../models/enums/order.ts';
import { ActivationStatus } from '../../../../../../models/enums/activation-status.ts';
import { Role } from '../../../../../../models/enums/roles.ts';
import { RoomOccupancyStatus } from '../../../../../../models/enums/room-occupancy-status.ts';
import { activationStatusRecord } from '../../../../../../models/enums-mapping/activation-status.ts';
import { roomOccupancyStatusRecord } from '../../../../../../models/enums-mapping/room-occupancy-status.ts';

import { useOrganizationRooms } from '../../../../hooks/room-hook.ts';
import { useCurrentUser } from '../../../../hooks/users-hook.ts';

import { getRoomColumns } from '../columns/RoomColumns.tsx';

import { useDialog } from '../../../../../../hooks/open-dialog.ts';

import type { RoomResponse } from '../../../../../../models/room.model.ts';

import { CreateRoomDialog } from '../components/CreateRoomDialog.tsx';
import { EditRoomDialog } from '../components/EditRoomDialog.tsx';

interface RoomsTableProps {
    organizationUuid?: string;
}

export function RoomsTable({ organizationUuid }: RoomsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });

    const [search, setSearch] = useState('');

    const [status, setStatus] = useState<ActivationStatus | undefined>();
    const [roomOccupancyStatus, setRoomOccupancyStatus] = useState<
        RoomOccupancyStatus | undefined
    >();

    const [createRoomOpen, setCreateRoomOpen] = useState(false);

    const roomDialog = useDialog<RoomResponse>();

    const { data: currentUser } = useCurrentUser();

    const canManageRooms =
        (currentUser?.role === Role.MANAGER || currentUser?.role === Role.OWNER) &&
        currentUser?.organizationUuid != null;

    const sort = sorting[0];

    const sortBy: 'name' | 'createdAtUTC' | undefined = sort
        ? sort.id === 'name'
            ? 'name'
            : 'createdAtUTC'
        : undefined;

    const order = sort ? (sort.desc ? Order.DESC : Order.ASC) : undefined;
    const { data, isLoading, isError, error, refetch } = useOrganizationRooms(
        organizationUuid,
        {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            sortBy,
            order,
            search: search || undefined,
            filter: {
                organizationUuid,
                ...(status && {
                    status,
                }),
                ...(roomOccupancyStatus && {
                    occupancyStatus: roomOccupancyStatus,
                }),
            },
        },
    );

    const columns = getRoomColumns(canManageRooms ? roomDialog.open : undefined);

    const resetPage = () => {
        setPagination((previous) => ({
            ...previous,
            pageIndex: 0,
        }));
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        resetPage();
    };

    const filters = (
        <div className="flex w-full min-w-0 flex-wrap items-center gap-2">
            <Select
                label="Status"
                isLabelDisabled
                value={status ?? ''}
                onChange={(event) => {
                    const value = event.target.value;

                    setStatus(value === '' ? undefined : (value as ActivationStatus));

                    resetPage();
                }}
                wrapperClassName="w-36 max-sm:w-[48%] max-[350px]:w-full"
                className="!h-8 px-2 text-[11px]"
            >
                <option value="">All statuses</option>

                {Object.values(ActivationStatus).map((statusValue) => (
                    <option key={statusValue} value={statusValue}>
                        {activationStatusRecord[statusValue]}
                    </option>
                ))}
            </Select>

            <Select
                label="Occupancy"
                isLabelDisabled
                value={roomOccupancyStatus ?? ''}
                onChange={(event) => {
                    const value = event.target.value;

                    setRoomOccupancyStatus(
                        value === '' ? undefined : (value as RoomOccupancyStatus),
                    );

                    resetPage();
                }}
                wrapperClassName="w-40 max-sm:w-[48%] max-[350px]:w-full"
                className="!h-8 px-2 text-[11px]"
            >
                <option value="">All occupancy statuses</option>

                {Object.values(RoomOccupancyStatus).map((statusValue) => (
                    <option key={statusValue} value={statusValue}>
                        {roomOccupancyStatusRecord[statusValue]}
                    </option>
                ))}
            </Select>
        </div>
    );

    const actions = canManageRooms ? (
        <Button
            type="button"
            onClick={() => setCreateRoomOpen(true)}
            className="flex h-8 min-h-0 w-auto shrink-0 items-center gap-1.5 px-3 text-[11px]"
        >
            <Plus className="size-3.5" strokeWidth={2} />
            Add Room
        </Button>
    ) : undefined;

    if (isError) {
        return (
            <ErrorState error={error} title="Failed to load rooms" onRetry={() => refetch()} />
        );
    }

    return (
        <>
            <DataTable
                tableKey="organization-rooms-table"
                data={data?.data ?? []}
                columns={columns}
                sorting={sorting}
                onSortingChange={setSorting}
                pagination={pagination}
                onPaginationChange={setPagination}
                search={search}
                onSearchChange={handleSearchChange}
                filters={filters}
                actions={actions}
                rowCount={data?.pagination?.totalItems ?? 0}
                rowCountLabel={`${
                    data?.pagination?.totalItems === 0 ? 'No' : data?.pagination?.totalItems
                } Rooms`}
                isLoading={isLoading}
                emptyMessage="No rooms match the current filters."
            />

            {canManageRooms && (
                <CreateRoomDialog
                    organizationUuid={organizationUuid}
                    open={createRoomOpen}
                    onOpenChange={setCreateRoomOpen}
                />
            )}

            {canManageRooms && roomDialog.selectedItem && (
                <EditRoomDialog
                    organizationUuid={organizationUuid}
                    room={roomDialog.selectedItem}
                    open={roomDialog.isOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            roomDialog.close();
                        }
                    }}
                />
            )}
        </>
    );
}
