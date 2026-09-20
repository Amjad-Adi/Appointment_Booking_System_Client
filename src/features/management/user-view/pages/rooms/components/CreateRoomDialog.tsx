import { useMemo } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import {
    CreateDialog,
    type CreateDialogField,
} from '../../../../../../components/CreateDialog.tsx';

import { useCreateOrganizationRoom } from '../../../../hooks/room-hook.ts';
import { createRoomSchema } from '../../../../../../zod-schemas/room.schema.ts';

interface CreateRoomDialogProps {
    organizationUuid?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type CreateRoomForm = z.input<typeof createRoomSchema>;
type CreateRoomFormOutput = z.output<typeof createRoomSchema>;

export function CreateRoomDialog({ organizationUuid, open, onOpenChange }: CreateRoomDialogProps) {
    const createMutation = useCreateOrganizationRoom(organizationUuid);

    const fields = useMemo<readonly CreateDialogField<CreateRoomForm>[]>(
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
        ],
        [],
    );

    async function handleSubmit(values: CreateRoomFormOutput) {
        await toast.promise(createMutation.mutateAsync(values), {
            loading: 'Creating room...',
            success: 'Room created successfully',
            error: 'Failed to create room',
        });

        onOpenChange(false);
    }

    return (
        <CreateDialog<CreateRoomForm, CreateRoomFormOutput>
            open={open}
            onOpenChange={onOpenChange}
            title="Create Room"
            description="Add a new room to this organization."
            resolver={zodResolver(createRoomSchema)}
            defaultValues={{
                name: '',
                description: '',
            }}
            fields={fields}
            submitLabel="Create Room"
            onSubmit={handleSubmit}
        />
    );
}
