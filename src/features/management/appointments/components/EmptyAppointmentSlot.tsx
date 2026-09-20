import { Plus } from 'lucide-react';

import { Button } from '../../../../components/Button.tsx';
import { formatTimeInTimeZone } from '../../user-view/utils/timezone.ts';

interface EmptyAppointmentSlotProps {
    startAt: Date;
    endAt: Date;
    organizationTimeZone: string;

    canCreate?: boolean;
    onAdd?: () => void;

    canCreateTimeBlock?: boolean;
    onAddTimeBlock?: () => void;
}

function formatDuration(startAt: Date, endAt: Date) {
    const minutes = Math.round((endAt.getTime() - startAt.getTime()) / 60000);

    if (minutes <= 0) return '0m';

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) return `${remainingMinutes}m`;
    if (remainingMinutes === 0) return `${hours}h`;

    return `${hours}h ${remainingMinutes}m`;
}

export function EmptyAppointmentSlot({
    startAt,
    endAt,
    organizationTimeZone,
    canCreate = false,
    onAdd,
    canCreateTimeBlock = false,
    onAddTimeBlock,
}: EmptyAppointmentSlotProps) {
    const startTime = formatTimeInTimeZone(startAt, organizationTimeZone);
    const endTime = formatTimeInTimeZone(endAt, organizationTimeZone);

    return (
        <article className="rounded-xl border border-dashed border-[#d3d3df] bg-[#f5f5f8] p-3">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] font-medium text-[#343447]">
                        {startTime} - {endTime}
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#777789]">
                        Available for {formatDuration(startAt, endAt)}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                    {canCreateTimeBlock ? (
                        <Button
                            type="button"
                            onClick={onAddTimeBlock}
                            className="flex h-7 w-fit items-center justify-center gap-1 px-2 text-[10px]"
                        >
                            <Plus className="size-3" strokeWidth={2} />
                            Add Time Block
                        </Button>
                    ) : null}

                    {canCreate ? (
                        <Button
                            type="button"
                            onClick={onAdd}
                            className="flex h-7 w-fit items-center justify-center gap-1 px-2 text-[10px]"
                        >
                            <Plus className="size-3" strokeWidth={2} />
                            Add Appointment
                        </Button>
                    ) : null}
                </div>
            </div>
        </article>
    );
}
