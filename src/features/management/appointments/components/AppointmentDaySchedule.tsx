import type { AppointmentResponse } from '../../../../models/appointment.model.ts';

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
    onViewAppointment?: (appointment: AppointmentResponse) => void;
    onEditAppointment?: (appointment: AppointmentResponse) => void;
}

function renderSegment(
    segment: AppointmentScheduleSegment,
    workerUuid: string,
    date: Date,
    organizationTimeZone: string,
    canCreate: boolean,
    onAddAppointment?: (date: Date, startAt: Date, workerUuid: string) => void,
    onViewAppointment?: (appointment: AppointmentResponse) => void,
    onEditAppointment?: (appointment: AppointmentResponse) => void,
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
        />
    );
}

export function AppointmentDaySchedule({
    date,
    workerSchedules,
    organizationTimeZone,
    canCreate = false,
    onAddAppointment,
    onViewAppointment,
    onEditAppointment,
}: AppointmentDayScheduleProps) {
    return (
        <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-4">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-[#343447]">Daily Schedule</h2>

                <p className="mt-0.5 text-[11px] text-[#777789]">
                    {formatDateInTimeZone(date, organizationTimeZone)}
                </p>
            </div>

            {workerSchedules.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#d3d3df] bg-white p-6 text-center">
                    <p className="text-sm font-medium text-[#343447]">No worker schedule</p>

                    <p className="mt-1 text-[11px] text-[#777789]">
                        There are no workers with appointments or time blocks for this date.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {workerSchedules.map((workerSchedule) => (
                        <section
                            key={workerSchedule.workerUuid}
                            className="overflow-hidden rounded-xl border border-[#d3d3df] bg-white"
                        >
                            <div className="border-b border-[#d3d3df] bg-[#ededf2] px-4 py-3">
                                <h3 className="text-sm font-semibold text-[#343447]">
                                    {workerSchedule.workerName}
                                </h3>

                                <p className="mt-0.5 text-[10px] text-[#777789]">Worker schedule</p>
                            </div>

                            <div className="space-y-2 p-3">
                                {workerSchedule.segments.map((segment) =>
                                    renderSegment(
                                        segment,
                                        workerSchedule.workerUuid,
                                        date,
                                        organizationTimeZone,
                                        canCreate,
                                        onAddAppointment,
                                        onViewAppointment,
                                        onEditAppointment,
                                    ),
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </section>
    );
}
