import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { TextField } from '../../../../../../../components/TextField.tsx';
import { EditDialog, type EditDialogField } from '../../../../../../../components/EditDialog.tsx';
import { updateInvitationSchema } from '../../../../../../../zod-schemas/invitations.schema.ts';
import { InvitationStatus } from '../../../../../../../models/enums/invitation-status.ts';
import type {
    InvitationResponse,
    UpdateInvitation,
} from '../../../../../../../models/invitation.model.ts';
import { useUpdateOrganizationInvitation } from '../../../../../hooks/invitation-hook.ts';

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

    const defaultValues = useMemo<UpdateInvitation>(
        () => ({
            status:
                invitation.status === InvitationStatus.PENDING
                    ? undefined
                    : (invitation.status as any),
        }),
        [invitation.status],
    );

    const fields = useMemo<readonly EditDialogField<UpdateInvitation>[]>(
        () => [
            {
                name: 'status',
                label: 'Status Action',
                type: 'select',
                placeholder: 'Keep Pending (No Change)',
                options: [
                    { value: InvitationStatus.CANCELLED, label: 'Cancel Invitation' },
                    { value: InvitationStatus.EXPIRED, label: 'Mark as Expired' },
                ],
            },
        ],
        [],
    );

    const handleSubmit = async (changedValues: Partial<UpdateInvitation>) => {
        if (!changedValues.status) {
            onOpenChange(false);
            return;
        }

        await toast.promise(
            updateMutation.mutateAsync({
                uuid: invitation.uuid,
                ...changedValues,
            }),
            {
                loading: 'Updating invitation...',
                success: 'Invitation updated successfully',
                error: (err: any) => err?.response?.data?.message || 'Failed to update invitation',
            },
        );
        onOpenChange(false);
    };

    return (
        <EditDialog<UpdateInvitation>
            open={open}
            onOpenChange={onOpenChange}
            title="Manage Invitation"
            description="Cancel this invitation or mark it as expired."
            resolver={zodResolver(updateInvitationSchema) as any}
            defaultValues={defaultValues}
            fields={fields}
            submitLabel="Update Status"
            onSubmit={handleSubmit}
            readOnlyContent={
                <>
                    <TextField
                        label="Recipient Email"
                        id="recipientEmail"
                        value={invitation.recipientEmail}
                        disabled
                    />
                    <TextField label="Assigned Role" id="role" value={invitation.role} disabled />
                    <TextField
                        label="Current Status"
                        id="currentStatus"
                        value={invitation.status}
                        disabled
                    />
                </>
            }
        />
    );
}