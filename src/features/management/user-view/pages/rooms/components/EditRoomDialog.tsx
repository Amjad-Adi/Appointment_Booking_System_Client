import { useMemo, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { EditDialog, type EditDialogField } from '../../../../../../components/EditDialog.tsx';

import { useUpdateOrganizationRoom } from '../../../../hooks/room-hook.ts';
import { useUsers } from '../../../../hooks/users-hook.ts';

import type { RoomResponse } from '../../../../../../models/room.model.ts';
import { ActivationStatus } from '../../../../../../models/enums/activation-status.ts';
import { RoomOccupancyStatus } from '../../../../../../models/enums/room-occupancy-status.ts';
import { Role } from '../../../../../../models/enums/roles.ts';
import { activationStatusRecord } from '../../../../../../models/enums-mapping/activation-status.ts';
import { roomOccupancyStatusRecord } from '../../../../../../models/enums-mapping/room-occupancy-status.ts';

import { PAGE_SIZE } from '../../../../../../components/DataTableFeatures.ts';

import { GENERAL_DEBOUNCE_DELAY, useDebounce } from '../../../../../../hooks/deounce.ts';

import { getApiErrorMessage, getApiFieldErrors } from '../../../../../../utlis/api-error.ts';

interface EditRoomDialogProps {
    organizationUuid?: string;
    room: RoomResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const editRoomFormSchema = z
    .object({
        name: z
            .string()
            .trim()
            .nonempty({ error: 'Room Name is required' })
            .max(256, { error: 'Room Name must be at most 256 characters' })
            .optional(),
        description: z
            .string()
            .trim()
            .max(4096, { error: 'Description must be at most 4096 characters' })
            .optional(),
        assignedUserUuid: z.string().nullable().optional(),
        status: z.enum(ActivationStatus).optional(),
        occupancyStatus: z.enum(RoomOccupancyStatus).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length !== 0, {
        message: 'At least one field must be provided',
    });

type EditRoomForm = z.input<typeof editRoomFormSchema>;
type EditRoomFormOutput = z.output<typeof editRoomFormSchema>;

export function EditRoomDialog({
    organizationUuid,
    room,
    open,
    onOpenChange,
}: EditRoomDialogProps) {
    const updateMutation = useUpdateOrganizationRoom(organizationUuid as string);

    /*
     * Raw search value entered by the user.
     */
    const [workerSearch, setWorkerSearch] = useState('');

    /*
     * Only this value is sent to the backend.
     */
    const debouncedWorkerSearch = useDebounce(workerSearch, GENERAL_DEBOUNCE_DELAY);

    const {
        data: usersData,
        isLoading: isLoadingUsers,
        isError: isUsersError,
    } = useUsers({
        page: 1,
        limit: PAGE_SIZE,
        search: debouncedWorkerSearch || undefined,
        filter: {
            role: Role.WORKER,
            status: ActivationStatus.ACTIVE,
        },
    });

    const defaultValues = useMemo<EditRoomForm>(
        () => ({
            name: room.name,
            description: room.description,
            assignedUserUuid: room.userUuid ?? '',
            status: room.status,
            occupancyStatus: room.occupancyStatus,
        }),
        [room],
    );

    const userOptions = useMemo(
        () => [
            {
                value: '',
                label: 'Unassigned',
            },
            ...(usersData?.data ?? []).map((user) => ({
                value: user.uuid,
                label: `${user.firstName} ${user.lastName} — ${user.email}`,
            })),
        ],
        [usersData],
    );

    const fields = useMemo<readonly EditDialogField<EditRoomForm>[]>(
        () => [
            {
                name: 'name',
                label: 'Name',
                type: 'text',
            },
            {
                name: 'description',
                label: 'Description',
                type: 'text',
            },
            {
                name: 'assignedUserUuid',
                label: 'Assigned Worker',
                type: 'searchable-select',
                options: userOptions,
                placeholder: isLoadingUsers
                    ? 'Loading workers...'
                    : isUsersError
                      ? 'Failed to load workers'
                      : 'Select a worker',
                searchPlaceholder: 'Search workers...',
                onSearchChange: setWorkerSearch,
            },
            {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: Object.values(ActivationStatus).map((status) => ({
                    value: status,
                    label: activationStatusRecord[status],
                })),
                showPlaceholder: false,
            },
            {
                name: 'occupancyStatus',
                label: 'Occupancy Status',
                type: 'select',
                options: Object.values(RoomOccupancyStatus).map((status) => ({
                    value: status,
                    label: roomOccupancyStatusRecord[status],
                })),
                showPlaceholder: false,
            },
        ],
        [userOptions, isLoadingUsers, isUsersError],
    );

    async function handleSubmit(changedValues: Partial<EditRoomFormOutput>) {
        const payload = {
            ...changedValues,
            ...('assignedUserUuid' in changedValues && {
                assignedUserUuid: changedValues.assignedUserUuid || null,
            }),
        };

        if (payload.description !== undefined && payload.description.trim() === '') {
            delete payload.description;
        }

        if (Object.keys(payload).length === 0) {
            onOpenChange(false);
            return;
        }

        try {
            await toast.promise(
                updateMutation.mutateAsync({
                    uuid: room.uuid,
                    ...payload,
                }),
                {
                    loading: 'Updating room...',
                    success: 'Room updated successfully',
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to update room'),
                },
            );
        } catch {
            return;
        }

        onOpenChange(false);
    }

    return (
        <EditDialog<EditRoomForm, EditRoomFormOutput>
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Room"
            description="Update this organization's room."
            resolver={zodResolver(editRoomFormSchema)}
            defaultValues={defaultValues}
            fields={fields}
            submitLabel="Apply Changes"
            errorMessage={
                updateMutation.isError && !getApiFieldErrors(updateMutation.error)
                    ? getApiErrorMessage(updateMutation.error, 'Failed to update room')
                    : undefined
            }
            fieldErrors={getApiFieldErrors(updateMutation.error)}
            onSubmit={handleSubmit}
        />
    );
}
