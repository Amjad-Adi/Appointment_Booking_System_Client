import { useMemo } from 'react';

import { TextField } from '../../../../../../../components/TextField.tsx';
import { EditDialog, type EditDialogField } from '../../../../../../../components/EditDialog.tsx';

import { useUpdateOrganization } from '../../../../../hooks/orgsnization-hook.ts';
import { updateOrganizationByAdminSchema } from '../../../../../../../zod-schemas/organization.schema.ts';

import { ActivationStatus } from '../../../../../../../models/enums/activation-status.ts';

import type {
    OrganizationResponse,
    UpdateOrganizationByAdminForm,
} from '../../../../../../../models/organization.model.ts';

import toast from 'react-hot-toast';
import { Toast } from '../../../../../../../utlis/toast.ts';
import { zodResolver } from '@hookform/resolvers/zod';

interface EditOrganizationDialogProps {
    organization: OrganizationResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const loading = 'Updating organization...';
const success = 'Organization updated successfully';
const error = 'Failed to update organization';

export function EditOrganizationDialog({
    organization,
    open,
    onOpenChange,
}: EditOrganizationDialogProps) {
    const updateOrganizationMutation = useUpdateOrganization();

    const defaultValues = useMemo<UpdateOrganizationByAdminForm>(
        () => ({
            status: organization.status,
        }),
        [organization.status],
    );

    const fields = useMemo<readonly EditDialogField<UpdateOrganizationByAdminForm>[]>(
        () => [
            {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: Object.values(ActivationStatus).map((status) => ({
                    value: status,
                    label: status,
                })),
                placeholder: 'Select status',
            },
        ],
        [],
    );

    const handleSubmit = async (changedValues: Partial<UpdateOrganizationByAdminForm>) => {
        await toast.promise(
            updateOrganizationMutation.mutateAsync({
                uuid: organization.uuid,
                ...changedValues,
            }),
            new Toast(loading, success, error),
        );

        onOpenChange(false);
    };

    return (
        <EditDialog<UpdateOrganizationByAdminForm>
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Organization"
            description="Update the organization's activation status."
            resolver={zodResolver(updateOrganizationByAdminSchema)}
            defaultValues={defaultValues}
            fields={fields}
            submitLabel="Apply Changes"
            errorMessage={
                updateOrganizationMutation.isError
                    ? 'Failed to update organization. Please try again.'
                    : undefined
            }
            onSubmit={handleSubmit}
            readOnlyContent={
                <>
                    <TextField label="Name" id="name" value={organization.name} disabled />

                    <TextField
                        label="Email"
                        id="email"
                        type="email"
                        value={organization.email}
                        disabled
                    />

                    <TextField
                        label="Phone Number"
                        id="phoneNumber"
                        value={organization.phoneNumber}
                        disabled
                    />
                </>
            }
        />
    );
}
