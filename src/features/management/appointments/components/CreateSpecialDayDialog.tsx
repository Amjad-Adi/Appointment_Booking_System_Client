import { useMemo } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { CreateDialog, type CreateDialogField } from '../../../../components/CreateDialog.tsx';

import { useCreateOrganizationSpecialDay } from '../../hooks/special-days-hook.ts';

import { createSpecialDaySchema } from '../../../../zod-schemas/special-days.schema.ts';
import { getApiErrorMessage, getApiFieldErrors } from '../../../../utlis/api-error.ts';

interface CreateSpecialDayDialogProps {
    organizationUuid?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dayDate: string;
}

type CreateSpecialDayForm = z.input<typeof createSpecialDaySchema>;
type CreateSpecialDayFormOutput = z.output<typeof createSpecialDaySchema>;

export function CreateSpecialDayDialog({
    organizationUuid,
    open,
    onOpenChange,
    dayDate,
}: CreateSpecialDayDialogProps) {
    const createMutation = useCreateOrganizationSpecialDay(organizationUuid);

    const defaultValues = useMemo<CreateSpecialDayForm>(
        () => ({
            name: 'Closed Day',
            dayDate,
            description: '',
        }),
        [dayDate],
    );

    const fields = useMemo<readonly CreateDialogField<CreateSpecialDayForm>[]>(
        () => [
            {
                name: 'name',
                label: 'Name',
                type: 'text',
                placeholder: 'e.g. Holiday',
            },
            {
                name: 'dayDate',
                label: 'Date',
                type: 'date',
            },
            {
                name: 'description',
                label: 'Reason',
                type: 'text',
                placeholder: 'Why is the organization unavailable?',
            },
        ],
        [],
    );

    async function handleSubmit(values: CreateSpecialDayFormOutput) {
        const description = values.description?.trim();

        try {
            await toast.promise(
                createMutation.mutateAsync({
                    name: values.name,
                    dayDate: values.dayDate,
                    ...(description ? { description } : {}),
                }),
                {
                    loading: 'Marking day as special...',
                    success: 'Special day created successfully',
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to create special day'),
                },
            );

            onOpenChange(false);
        } catch {
            // toast.promise already surfaced the error.
        }
    }

    return (
        <CreateDialog<CreateSpecialDayForm, CreateSpecialDayFormOutput>
            key={`${open}-${dayDate}`}
            open={open}
            onOpenChange={onOpenChange}
            title="Mark as Special Day"
            description="Mark this organization day as unavailable."
            resolver={zodResolver(createSpecialDaySchema)}
            defaultValues={defaultValues}
            fields={fields}
            submitLabel="Mark Day"
            errorMessage={
                createMutation.isError && !getApiFieldErrors(createMutation.error)
                    ? getApiErrorMessage(createMutation.error, 'Failed to create the special day')
                    : undefined
            }
            fieldErrors={getApiFieldErrors(createMutation.error)}
            onSubmit={handleSubmit}
        />
    );
}
