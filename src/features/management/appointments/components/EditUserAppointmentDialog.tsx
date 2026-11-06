import { useMemo } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { EditDialog, type EditDialogField } from '../../../../components/EditDialog.tsx';

import { useUpdateAppointmentByUser } from '../../hooks/appointment-hook.ts';

import { updateAppointmentSchemaByUser } from '../../../../zod-schemas/appointment.schema.ts';

import type { UserAppointmentResponse } from '../../../../models/appointment.model.ts';
import { getApiErrorMessage, getApiFieldErrors } from '../../../../utlis/api-error.ts';

interface EditUserAppointmentDialogProps {
    appointment: UserAppointmentResponse;

    open: boolean;

    onOpenChange: (open: boolean) => void;
}

type EditUserAppointmentForm = z.input<typeof updateAppointmentSchemaByUser>;

type EditUserAppointmentFormOutput = z.output<typeof updateAppointmentSchemaByUser>;

export function EditUserAppointmentDialog({
    appointment,
    open,
    onOpenChange,
}: EditUserAppointmentDialogProps) {
    const updateMutation = useUpdateAppointmentByUser();

    const defaultValues = useMemo<EditUserAppointmentForm>(
        () => ({
            userTitle: appointment.userTitle ?? '',

            userNote: appointment.userNote,

            userColour: appointment.userColour || '#2563EB',
        }),
        [appointment],
    );

    const fields = useMemo<readonly EditDialogField<EditUserAppointmentForm>[]>(
        () => [
            {
                name: 'userTitle',

                label: 'Appointment Title',

                type: 'text',

                placeholder: 'Enter appointment title',
            },

            {
                name: 'userNote',

                label: 'Your Note',

                type: 'text',

                placeholder: 'Optional note',
            },

            {
                name: 'userColour',

                label: 'Appointment Colour',

                type: 'color',
            },
        ],
        [],
    );

    async function handleSubmit(changedValues: Partial<EditUserAppointmentFormOutput>) {
        try {
            await toast.promise(
                updateMutation.mutateAsync({
                    uuid: appointment.uuid,

                    ...changedValues,
                }),
                {
                    loading: 'Updating appointment...',

                    success: 'Appointment updated successfully',

                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to update appointment'),
                },
            );

            onOpenChange(false);
        } catch {
            // toast.promise already surfaced the error.
        }
    }

    return (
        <EditDialog<EditUserAppointmentForm, EditUserAppointmentFormOutput>
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Appointment"
            description="Update your appointment title, note and colour."
            resolver={zodResolver(updateAppointmentSchemaByUser)}
            defaultValues={defaultValues}
            fields={fields}
            submitLabel="Apply Changes"
            errorMessage={
                updateMutation.isError && !getApiFieldErrors(updateMutation.error)
                    ? getApiErrorMessage(updateMutation.error, 'Failed to update appointment')
                    : undefined
            }
            fieldErrors={getApiFieldErrors(updateMutation.error)}
            onSubmit={handleSubmit}
        />
    );
}
