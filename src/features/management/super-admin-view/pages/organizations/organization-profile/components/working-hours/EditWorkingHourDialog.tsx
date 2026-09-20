import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    EditDialog,
    type EditDialogField,
} from '../../../../../../../../components/EditDialog.tsx';
import { Toast } from '../../../../../../../../utlis/toast.ts';
import {
    updateWorkingHoursForm,
    updateWorkingHoursSchema,
} from '../../../../../../../../zod-schemas/working-hours.schema.ts';
import { useUpdateOrganizationWorkingHours } from '../../../../../../hooks/working-hours-hook.ts';
import type {
    WorkingHours,
    UpdateWorkingHours,
} from '../../../../../../../../models/working-hours.model.ts';

interface EditWorkingHourDialogProps {
    organizationUuid: string;
    workingHour: WorkingHours;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface WorkingHourFormValues {
    startTime?: string | null;
    endTime?: string | null;
    isClosed: boolean;
}

export function EditWorkingHourDialog({
    organizationUuid,
    workingHour,
    open,
    onOpenChange,
}: EditWorkingHourDialogProps) {
    const updateMutation = useUpdateOrganizationWorkingHours(organizationUuid);

    const defaultValues = useMemo<WorkingHourFormValues>(
        () => ({
            startTime: workingHour.startTime?.substring(0, 5) ?? null,
            endTime: workingHour.endTime?.substring(0, 5) ?? null,
            // If both start and end times are missing/null, assume the day is currently closed
            isClosed: !workingHour.startTime && !workingHour.endTime,
        }),
        [workingHour],
    );

    const fields = useMemo<readonly EditDialogField<WorkingHourFormValues>[]>(
        () => [
            {
                name: 'startTime',
                label: 'Opening Time',
                type: 'time',
                placeholder: '09:00',
            },
            {
                name: 'endTime',
                label: 'Closing Time',
                type: 'time',
                placeholder: '17:00',
            },
            {
                name: 'isClosed',
                label: 'Weekend / Closed',
                type: 'checkbox',
                placeholder: 'Mark this day as closed',
            },
        ],
        [],
    );

    // 2. Accept the partial form values, merge with defaults, then build the full backend payload
    const handleSubmit = async (changedValues: Partial<WorkingHourFormValues>) => {
        // The EditDialog only sends fields that were changed.
        // We merge with defaultValues so we have access to the unmodified times if only the checkbox was toggled.
        const currentFormState = { ...defaultValues, ...changedValues };

        const payload: UpdateWorkingHours = {
            uuid: workingHour.uuid,
            startTime: currentFormState.isClosed ? null : currentFormState.startTime || null,
            endTime: currentFormState.isClosed ? null : currentFormState.endTime || null,
        };

        await toast.promise(
            updateMutation.mutateAsync(payload),
            new Toast('Updating hours...', 'Working hours updated', 'Failed to update hours'),
        );

        onOpenChange(false);
    };

    return (
        <EditDialog<WorkingHourFormValues, WorkingHourFormValues>
            open={open}
            onOpenChange={onOpenChange}
            title={`Edit ${workingHour.dayOfWeek.toLowerCase()} Hours`}
            description="Set the opening and closing time, or mark the day as closed."
            resolver={zodResolver(updateWorkingHoursForm)}
            defaultValues={defaultValues}
            fields={fields}
            submitLabel="Save Hours"
            onSubmit={handleSubmit}
        />
    );
}
