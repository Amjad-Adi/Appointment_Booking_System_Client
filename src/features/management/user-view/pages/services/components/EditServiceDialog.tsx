import { useMemo } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { EditDialog, type EditDialogField } from '../../../../../../components/EditDialog.tsx';

import { TextField } from '../../../../../../components/TextField.tsx';

import { useUpdateOrganizationService } from '../../../../hooks/services-hook.ts';

import { updateServiceSchema } from '../../../../../../zod-schemas/service.schema.ts';

import type { ServiceResponse } from '../../../../../../models/service.model.ts';

import { ActivationStatus } from '../../../../../../models/enums/activation-status.ts';

interface EditServiceDialogProps {
    organizationUuid?: string;
    service: ServiceResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type EditServiceForm = z.input<typeof updateServiceSchema>;
type EditServiceFormOutput = z.output<typeof updateServiceSchema>;

export function EditServiceDialog({
    organizationUuid,
    service,
    open,
    onOpenChange,
}: EditServiceDialogProps) {
    const updateMutation = useUpdateOrganizationService(organizationUuid as string);

    const defaultValues = useMemo<EditServiceForm>(
        () => ({
            name: service.name,
            description: service.description,
            price: service.price,
            durationInMinutes: service.durationInMinutes,
            profilePicturePath: service.profilePicturePath,
            status: service.status,
        }),
        [service],
    );

    const fields = useMemo<readonly EditDialogField<EditServiceForm>[]>(
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
                name: 'price',
                label: 'Price',
                type: 'text',
            },
            {
                name: 'durationInMinutes',
                label: 'Duration',
                type: 'text',
            },
            {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: Object.values(ActivationStatus).map((status) => ({
                    value: status,
                    label: status,
                })),
                showPlaceholder: false,
            },
        ],
        [],
    );

    async function handleSubmit(changedValues: Partial<EditServiceFormOutput>) {
        await toast.promise(
            updateMutation.mutateAsync({
                uuid: service.uuid,
                ...changedValues,
            }),
            {
                loading: 'Updating service...',
                success: 'Service updated successfully',
                error: 'Failed to update service',
            },
        );

        onOpenChange(false);
    }

    return (
        <EditDialog<EditServiceForm, EditServiceFormOutput>
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Service"
            description="Update this organization's service."
            resolver={zodResolver(updateServiceSchema)}
            defaultValues={defaultValues}
            fields={fields}
            submitLabel="Apply Changes"
            errorMessage={
                updateMutation.isError ? 'Failed to update service. Please try again.' : undefined
            }
            onSubmit={handleSubmit}
        />
    );
}
