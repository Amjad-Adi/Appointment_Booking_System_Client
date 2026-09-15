import { useMemo } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { EditDialog, type EditDialogField } from '../../../../components/EditDialog.tsx';

import { useUpdateOrganizationAppointment } from '../../hooks/appointment-hook.ts';

import { updateAppointmentSchemaByOrganization } from '../../../../zod-schemas/appointment.schema.ts';

import type { AppointmentResponse } from '../../../../models/appointment.model.ts';

interface EditAppointmentDialogProps {
    organizationUuid?: string;
    appointment: AppointmentResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type EditAppointmentForm = z.input<typeof updateAppointmentSchemaByOrganization>;

type EditAppointmentFormOutput = z.output<typeof updateAppointmentSchemaByOrganization>;

export function EditAppointmentDialog({
    organizationUuid,
    appointment,
    open,
    onOpenChange,
}: EditAppointmentDialogProps) {
    const updateMutation = useUpdateOrganizationAppointment(organizationUuid);

    const defaultValues = useMemo<EditAppointmentForm>(
        () => ({
            organizationNote: appointment.organizationNote,
            organizationColour: appointment.organizationColour,
        }),
        [appointment],
    );

    const fields = useMemo<readonly EditDialogField<EditAppointmentForm>[]>(
        () => [
            {
                name: 'organizationNote',
                label: 'Organization Note',
                type: 'text',
            },
            {
                name: 'organizationColour',
                label: 'Organization Colour',
                type: 'text',
            },
        ],
        [],
    );

    async function handleSubmit(changedValues: Partial<EditAppointmentFormOutput>) {
        await toast.promise(
            updateMutation.mutateAsync({
                uuid: appointment.uuid,
                ...changedValues,
            }),
            {
                loading: 'Updating appointment...',
                success: 'Appointment updated successfully',
                error: 'Failed to update appointment',
            },
        );

        onOpenChange(false);
    }

    return (
        <EditDialog<EditAppointmentForm, EditAppointmentFormOutput>
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Appointment"
            description="Update the organization's appointment information."
            resolver={zodResolver(updateAppointmentSchemaByOrganization)}
            defaultValues={defaultValues}
            fields={fields}
            submitLabel="Apply Changes"
            errorMessage={
                updateMutation.isError
                    ? 'Failed to update appointment. Please try again.'
                    : undefined
            }
            onSubmit={handleSubmit}
        />
    );
}
