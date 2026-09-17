import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { EditDialog, type EditDialogField } from '../../../../../../components/EditDialog.tsx';

import { Toast } from '../../../../../../utlis/toast.ts';

import { updateInvitationSchema } from '../../../../../../zod-schemas/invitations.schema.ts';

import type {
    InvitationResponse,
    UpdateInvitation,
} from '../../../../../../models/invitation.model.ts';

import { InvitationStatus } from '../../../../../../models/enums/invitation-status.ts';

import { useUpdateOrganizationInvitation } from '../../../../hooks/invitation-hook.ts';

interface EditInvitationDialogProps {
    organizationUuid?: string;
    invitation: InvitationResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type EditInvitationForm = UpdateInvitation;

const loading = 'Updating invitation...';
const success = 'Invitation updated successfully';
const error = 'Failed to update invitation';

export function EditInvitationDialog({
    organizationUuid,
    invitation,
    open,
    onOpenChange,
}: EditInvitationDialogProps) {
    const updateMutation = useUpdateOrganizationInvitation(organizationUuid);

    const defaultValues = useMemo<EditInvitationForm>(
        () => ({
            status: invitation.invitationStatus,
        }),
        [invitation.invitationStatus],
    );

    const fields = useMemo<readonly EditDialogField<EditInvitationForm>[]>(
        () => [
            {
                name: 'status',
                label: 'Status',
                type: 'select',
                showPlaceholder: false,
                options: Object.values(InvitationStatus).map((status) => ({
                    value: status,
                    label: status,
                })),
            },
        ],
        [],
    );

    async function handleSubmit(changedValues: Partial<EditInvitationForm>): Promise<void> {
        try {
            await toast.promise(
                updateMutation.mutateAsync({
                    uuid: invitation.uuid,
                    ...changedValues,
                }),
                new Toast(loading, success, error),
            );

            onOpenChange(false);
        } catch {
            // The toast displays the mutation error.
        }
    }

    return (
        <EditDialog<EditInvitationForm>
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Invitation"
            description="Update the status of this invitation."
            resolver={zodResolver(updateInvitationSchema)}
            defaultValues={defaultValues}
            fields={fields}
            submitLabel="Apply Changes"
            errorMessage={
                updateMutation.isError
                    ? 'Failed to update invitation. Please try again.'
                    : undefined
            }
            onSubmit={handleSubmit}
        />
    );
}
