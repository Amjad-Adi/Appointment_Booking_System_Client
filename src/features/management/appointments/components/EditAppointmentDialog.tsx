import { useMemo } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { EditDialog, type EditDialogField } from '../../../../components/EditDialog.tsx';

import { useUpdateOrganizationAppointment } from '../../hooks/appointment-hook.ts';

import { updateAppointmentSchemaByOrganization } from '../../../../zod-schemas/appointment.schema.ts';

import type { OrganizationAppointmentResponse } from '../../../../models/appointment.model.ts';

interface EditAppointmentDialogProps {
    organizationUuid?: string;

    appointment: OrganizationAppointmentResponse;

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
            organizationTitle: appointment.organizationTitle ?? '',

            organizationNote: appointment.organizationNote,

            organizationColour: appointment.organizationColour || '#2563EB',
        }),
        [appointment],
    );

    const fields = useMemo<readonly EditDialogField<EditAppointmentForm>[]>(
        () => [
            {
                name: 'organizationTitle',

                label: 'Appointment Title',

                type: 'text',

                placeholder: 'Enter appointment title',
            },

            {
                name: 'organizationNote',

                label: 'Organization Note',

                type: 'text',

                placeholder: 'Optional note',
            },

            {
                name: 'organizationColour',

                label: 'Organization Colour',

                type: 'color',
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
