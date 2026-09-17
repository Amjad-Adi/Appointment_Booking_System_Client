import { useMemo } from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import toast from 'react-hot-toast';

import {
    CreateDialog,
    type CreateDialogField,
} from '../../../../../../components/CreateDialog.tsx';

import { useCreateOrganizationInvitation } from '../../../../hooks/invitation-hook.ts';

import { createInvitationSchema } from '../../../../../../zod-schemas/invitations.schema.ts';

interface CreateInvitationDialogProps {
    organizationUuid?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type CreateInvitationForm = z.input<typeof createInvitationSchema>;

type CreateInvitationFormOutput = z.output<typeof createInvitationSchema>;

export function CreateInvitationDialog({
    organizationUuid,
    open,
    onOpenChange,
}: CreateInvitationDialogProps) {
    const createMutation = useCreateOrganizationInvitation(organizationUuid);

    const fields = useMemo<readonly CreateDialogField<CreateInvitationForm>[]>(
        () => [
            {
                name: 'email',
                label: 'Email',
                type: 'text',
            },
            {
                name: 'expiresAtUTC',
                label: 'Expires At',
                type: 'datetime-local',
            },
        ],
        [],
    );

    async function handleSubmit(values: CreateInvitationFormOutput) {
        await toast.promise(
            createMutation.mutateAsync({
                ...values,
                expiresAtUTC: new Date(values.expiresAtUTC).toISOString(),
            }),
            {
                loading: 'Sending invitation...',
                success: 'Invitation sent successfully',
                error: 'Failed to send invitation',
            },
        );

        onOpenChange(false);
    }

    return (
        <CreateDialog<CreateInvitationForm, CreateInvitationFormOutput>
            open={open}
            onOpenChange={onOpenChange}
            title="Invite User"
            description="Send an invitation to a user to join this organization."
            resolver={zodResolver(createInvitationSchema)}
            defaultValues={{
                email: '',
                expiresAtUTC: '',
            }}
            fields={fields}
            submitLabel="Send Invitation"
            onSubmit={handleSubmit}
        />
    );
}
