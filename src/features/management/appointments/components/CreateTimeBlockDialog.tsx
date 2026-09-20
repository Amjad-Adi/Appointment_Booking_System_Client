import { useMemo } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { CreateDialog, type CreateDialogField } from '../../../../components/CreateDialog.tsx';

import { useCreateOrganizationTimeBlock } from '../../hooks/time-block-hook.ts';

import { createTimeBlockSchema } from '../../../../zod-schemas/time-block.schema.ts';

import { formatDateTimeForInput, localDateTimeToISO } from '../../user-view/utils/date.ts';

interface CreateTimeBlockDialogProps {
    organizationUuid?: string;
    organizationTimeZone: string;

    open: boolean;
    onOpenChange: (open: boolean) => void;

    startAt?: Date;
    endAt?: Date;
}

type CreateTimeBlockForm = z.input<typeof createTimeBlockSchema>;
type CreateTimeBlockFormOutput = z.output<typeof createTimeBlockSchema>;

export function CreateTimeBlockDialog({
    organizationUuid,
    organizationTimeZone,
    open,
    onOpenChange,
    startAt,
    endAt,
}: CreateTimeBlockDialogProps) {
    const createMutation = useCreateOrganizationTimeBlock(organizationUuid);

    const defaultValues = useMemo<CreateTimeBlockForm>(() => {
        if (!startAt || !endAt) {
            return {
                reason: '',
                startAtUTC: '',
                endAtUTC: '',
            };
        }

        return {
            reason: '',
            startAtUTC: formatDateTimeForInput(startAt, organizationTimeZone),
            endAtUTC: formatDateTimeForInput(endAt, organizationTimeZone),
        };
    }, [startAt, endAt, organizationTimeZone]);

    const fields = useMemo<readonly CreateDialogField<CreateTimeBlockForm>[]>(
        () => [
            {
                name: 'reason',
                label: 'Reason',
                type: 'text',
                placeholder: 'Why are you unavailable?',
            },
            {
                name: 'startAtUTC',
                label: 'Start',
                type: 'datetime-local',
            },
            {
                name: 'endAtUTC',
                label: 'End',
                type: 'datetime-local',
            },
        ],
        [],
    );

    async function handleSubmit(values: CreateTimeBlockForm) {
        const payload: CreateTimeBlockFormOutput = {
            reason: values.reason,
            startAtUTC: localDateTimeToISO(values.startAtUTC, organizationTimeZone),
            endAtUTC: localDateTimeToISO(values.endAtUTC, organizationTimeZone),
        };

        await toast.promise(createMutation.mutateAsync(payload), {
            loading: 'Creating time block...',
            success: 'Time block created successfully',
            error: 'Failed to create time block',
        });

        onOpenChange(false);
    }

    return (
        <CreateDialog<CreateTimeBlockForm, CreateTimeBlockFormOutput>
            key={`${open}-${startAt?.getTime() ?? ''}-${endAt?.getTime() ?? ''}`}
            open={open}
            onOpenChange={onOpenChange}
            title="Add Time Block"
            description="Mark this period as unavailable for you."
            resolver={zodResolver(createTimeBlockSchema)}
            defaultValues={defaultValues}
            fields={fields}
            submitLabel="Add Time Block"
            errorMessage={
                createMutation.isError
                    ? 'Failed to create the time block. Please try again.'
                    : undefined
            }
            onSubmit={handleSubmit}
        />
    );
}
