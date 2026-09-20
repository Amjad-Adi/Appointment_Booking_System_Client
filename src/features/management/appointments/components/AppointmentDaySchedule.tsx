import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import type { OrganizationAppointmentResponse } from '../../../../models/appointment.model.ts';

import type {
    AppointmentScheduleSegment,
    WorkerSchedule,
} from '../../../../models/appointment-schedule.model.ts';

import { AppointmentCard } from './AppointmentCard.tsx';
import { EmptyAppointmentSlot } from './EmptyAppointmentSlot.tsx';
import { TimeBlockCard } from './TimeBlockCard.tsx';

import { formatDateInTimeZone } from '../../user-view/utils/timezone.ts';

interface AppointmentDayScheduleProps {
    date: Date;
    workerSchedules: WorkerSchedule[];
    organizationTimeZone: string;

    canCreate?: boolean;
    onAddAppointment?: (date: Date, startAt: Date, workerUuid: string) => void;

    canCreateTimeBlock?: boolean;
    onAddTimeBlock?: (date: Date, startAt: Date, endAt: Date, workerUuid: string) => void;

    onViewAppointment?: (appointment: OrganizationAppointmentResponse) => void;

    onEditAppointment?: (appointment: OrganizationAppointmentResponse) => void;
}

function renderSegment(
    segment: AppointmentScheduleSegment,
    workerUuid: string,
    date: Date,
    organizationTimeZone: string,
    canCreate: boolean,
    canCreateTimeBlock: boolean,
    onAddAppointment?: (date: Date, startAt: Date, workerUuid: string) => void,
    onAddTimeBlock?: (date: Date, startAt: Date, endAt: Date, workerUuid: string) => void,
    onViewAppointment?: (appointment: OrganizationAppointmentResponse) => void,
    onEditAppointment?: (appointment: OrganizationAppointmentResponse) => void,
) {
    if (segment.type === 'appointment') {
        return (
            <AppointmentCard
                key={`appointment-${segment.appointment.uuid}`}
                appointment={segment.appointment}
                organizationTimeZone={organizationTimeZone}
                onView={onViewAppointment}
                onEdit={onEditAppointment}
            />
        );
    }

    if (segment.type === 'time-block') {
        return (
            <TimeBlockCard
                key={`time-block-${segment.timeBlock.uuid}`}
                timeBlock={segment.timeBlock}
                organizationTimeZone={organizationTimeZone}
            />
        );
    }

    return (
        <EmptyAppointmentSlot
            key={`empty-${segment.startAt.getTime()}-${segment.endAt.getTime()}`}
            startAt={segment.startAt}
            endAt={segment.endAt}
            organizationTimeZone={organizationTimeZone}
            canCreate={canCreate}
            onAdd={() => {
                onAddAppointment?.(date, segment.startAt, workerUuid);
            }}
            canCreateTimeBlock={canCreateTimeBlock}
            onAddTimeBlock={() => {
                onAddTimeBlock?.(date, segment.startAt, segment.endAt, workerUuid);
            }}
        />
    );
}

export function AppointmentDaySchedule({
    date,
    workerSchedules,
    organizationTimeZone,
    canCreate = false,
    onAddAppointment,
    canCreateTimeBlock = false,
    onAddTimeBlock,
    onViewAppointment,
    onEditAppointment,
}: AppointmentDayScheduleProps) {
    const [collapsedWorkers, setCollapsedWorkers] = useState<Set<string>>(new Set());

    const toggleWorker = (workerUuid: string) => {
        setCollapsedWorkers((current) => {
            const next = new Set(current);

            if (next.has(workerUuid)) {
                next.delete(workerUuid);
            } else {
                next.add(workerUuid);
            }

            return next;
        });
    };

    return (
        <section className="flex max-h-[calc(100vh-8rem)] min-h-0 min-w-0 flex-col rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-4">
            <div className="mb-4 shrink-0">
                <h2 className="text-base font-semibold text-[#343447]">Daily Schedule</h2>

                <p className="mt-0.5 text-[11px] text-[#777789]">
                    {formatDateInTimeZone(date, organizationTimeZone)}
                </p>
            </div>

            {workerSchedules.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#d3d3df] bg-white p-6 text-center">
                    <p className="text-sm font-medium text-[#343447]">No worker schedule</p>

                    <p className="mt-1 text-[11px] text-[#777789]">
                        There are no workers available for this date.
                    </p>
                </div>
            ) : (
                <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    <div className="divide-y divide-[#d3d3df]">
                        {workerSchedules.map((workerSchedule) => {
                            const isCollapsed = collapsedWorkers.has(workerSchedule.workerUuid);

                            return (
                                <section
                                    key={workerSchedule.workerUuid}
                                    className="py-3 first:pt-0 last:pb-0"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleWorker(workerSchedule.workerUuid)}
                                        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[#e2e2ec]"
                                        aria-expanded={!isCollapsed}
                                    >
                                        <ChevronDown
                                            className={[
                                                'size-4 shrink-0 text-[#777789] transition-transform duration-200',
                                                isCollapsed ? 'rotate-0' : 'rotate-180',
                                            ].join(' ')}
                                        />

                                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#777789]" />

                                        <span className="min-w-0 truncate text-xs font-semibold text-[#343447]">
                                            {workerSchedule.workerName}
                                        </span>
                                    </button>

                                    <div
                                        className={[
                                            'grid transition-all duration-200 ease-in-out',
                                            isCollapsed
                                                ? 'grid-rows-[0fr] opacity-0'
                                                : 'grid-rows-[1fr] opacity-100',
                                        ].join(' ')}
                                    >
                                        <div className="min-h-0 overflow-hidden">
                                            <div
                                                className={[
                                                    'mt-2 overflow-hidden rounded-xl border border-[#d3d3df] bg-white transition-transform duration-200',
                                                    isCollapsed
                                                        ? '-translate-y-1'
                                                        : 'translate-y-0',
                                                ].join(' ')}
                                            >
                                                <div className="space-y-2 p-3">
                                                    {workerSchedule.segments.map((segment) =>
                                                        renderSegment(
                                                            segment,
                                                            workerSchedule.workerUuid,
                                                            date,
                                                            organizationTimeZone,
                                                            canCreate,
                                                            canCreateTimeBlock,
                                                            onAddAppointment,
                                                            onAddTimeBlock,
                                                            onViewAppointment,
                                                            onEditAppointment,
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}
