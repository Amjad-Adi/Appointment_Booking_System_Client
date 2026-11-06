import { useMemo } from 'react';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { TextField } from '../../../../../../../components/TextField.tsx';
import { EditDialog, type EditDialogField } from '../../../../../../../components/EditDialog.tsx';
import { updateInvitationByOrganizationSchema } from '../../../../../../../zod-schemas/invitations.schema.ts';
import { InvitationStatus } from '../../../../../../../models/enums/invitation-status.ts';
import { invitationStatusRecord } from '../../../../../../../models/enums-mapping/invitation-status.ts';
import { roleRecord } from '../../../../../../../models/enums-mapping/roles.ts';
import type { InvitationResponse } from '../../../../../../../models/invitation.model.ts';
import { useUpdateOrganizationInvitation } from '../../../../../hooks/invitation-hook.ts';
import { getApiErrorMessage, getApiFieldErrors } from '../../../../../../../utlis/api-error.ts';

type UpdateInvitationForm = z.infer<typeof updateInvitationByOrganizationSchema>;

interface EditInvitationDialogProps {
    organizationUuid: string;
    invitation: InvitationResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditInvitationDialog({
    organizationUuid,
    invitation,
    open,
    onOpenChange,
}: EditInvitationDialogProps) {
    const updateMutation = useUpdateOrganizationInvitation(organizationUuid);

    const defaultValues = useMemo<UpdateInvitationForm>(
        () => ({
            status:
                invitation.status === InvitationStatus.CANCELLED
                    ? InvitationStatus.CANCELLED
                    : undefined,
        }),
        [invitation.status],
    );

    const fields = useMemo<readonly EditDialogField<UpdateInvitationForm>[]>(
        () => [
            {
                name: 'status',
                label: 'Status Action',
                type: 'select',
                placeholder: 'Keep Pending (No Change)',
                options: [{ value: InvitationStatus.CANCELLED, label: 'Cancel Invitation' }],
            },
        ],
        [],
    );

    const handleSubmit = async (changedValues: Partial<UpdateInvitationForm>) => {
        if (!changedValues.status) {
            onOpenChange(false);
            return;
        }

        try {
            await toast.promise(
                updateMutation.mutateAsync({
                    uuid: invitation.uuid,
                    ...changedValues,
                }),
                {
                    loading: 'Updating invitation...',
                    success: 'Invitation updated successfully',
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to update invitation'),
                },
            );
        } catch {
            return;
        }

        onOpenChange(false);
    };

    return (
        <EditDialog<UpdateInvitationForm>
            open={open}
            onOpenChange={onOpenChange}
            title="Manage Invitation"
            description="Cancel this invitation."
            resolver={zodResolver(updateInvitationByOrganizationSchema)}
            defaultValues={defaultValues}
            fields={fields}
            submitLabel="Update Status"
            errorMessage={
                updateMutation.isError && !getApiFieldErrors(updateMutation.error)
                    ? getApiErrorMessage(updateMutation.error, 'Failed to update invitation')
                    : undefined
            }
            fieldErrors={getApiFieldErrors(updateMutation.error)}
            onSubmit={handleSubmit}
            readOnlyContent={
                <>
                    <TextField
                        label="Recipient Email"
                        id="recipientEmail"
                        value={invitation.recipientEmail}
                        disabled
                    />
                    <TextField
                        label="Assigned Role"
                        id="role"
                        value={roleRecord[invitation.role]}
                        disabled
                    />
                    <TextField
                        label="Current Status"
                        id="currentStatus"
                        value={invitationStatusRecord[invitation.status]}
                        disabled
                    />
                </>
            }
        />
    );
}
