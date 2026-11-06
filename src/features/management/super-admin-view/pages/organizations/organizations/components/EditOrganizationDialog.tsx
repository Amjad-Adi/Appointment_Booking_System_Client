import { useMemo, useState } from 'react';

import { TextField } from '../../../../../../../components/TextField.tsx';
import { ImagePicker } from '../../../../../../../components/ImagePicker.tsx';
import { EditDialog, type EditDialogField } from '../../../../../../../components/EditDialog.tsx';

import { useUpdateOrganization } from '../../../../../hooks/organization-hook.ts';
import { updateOrganizationByAdminSchema } from '../../../../../../../zod-schemas/organization.schema.ts';

import { ActivationStatus } from '../../../../../../../models/enums/activation-status.ts';
import { activationStatusRecord } from '../../../../../../../models/enums-mapping/activation-status.ts';

import type {
    OrganizationResponse,
    UpdateOrganizationByAdminForm,
} from '../../../../../../../models/organization.model.ts';

import toast from 'react-hot-toast';
import { Toast } from '../../../../../../../utlis/toast.ts';
import { getApiErrorMessage, getApiFieldErrors } from '../../../../../../../utlis/api-error.ts';
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
    const [picture, setPicture] = useState<File | null>(null);

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
                    label: activationStatusRecord[status],
                })),
                placeholder: 'Select status',
            },
        ],
        [],
    );

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setPicture(null);
        }

        onOpenChange(nextOpen);
    };

    const handleSubmit = async (changedValues: Partial<UpdateOrganizationByAdminForm>) => {
        const hasFieldChanges = Object.keys(changedValues).length > 0;

        try {
            await toast.promise(
                updateOrganizationMutation.mutateAsync({
                    uuid: organization.uuid,
                    ...(hasFieldChanges ? changedValues : { status: organization.status }),
                    picture,
                }),
                {
                    loading,
                    success,
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, error),
                },
            );

            setPicture(null);
            onOpenChange(false);
        } catch {
            // toast.promise already surfaced the error.
        }
    };

    return (
        <EditDialog<UpdateOrganizationByAdminForm>
            open={open}
            onOpenChange={handleOpenChange}
            title="Edit Organization"
            description="Update the organization's activation status."
            resolver={zodResolver(updateOrganizationByAdminSchema)}
            defaultValues={defaultValues}
            fields={fields}
            topContent={
                <ImagePicker
                    file={picture}
                    onChange={setPicture}
                    currentPath={organization.profilePicturePath}
                    label="Organization Picture"
                />
            }
            hasExternalChanges={picture !== null}
            submitLabel="Apply Changes"
            errorMessage={
                updateOrganizationMutation.isError &&
                !getApiFieldErrors(updateOrganizationMutation.error)
                    ? getApiErrorMessage(
                          updateOrganizationMutation.error,
                          'Failed to update organization',
                      )
                    : undefined
            }
            fieldErrors={getApiFieldErrors(updateOrganizationMutation.error)}
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
