import type {
    OrganizationAppointment,
    OrganizationAppointmentResponse,
} from '../../../../models/appointment.model.ts';
import type { WorkingHours } from '../../../../models/working-hours.model.ts';
import type { TimeBlockResponse } from '../../../../models/time-block.model.ts';
import type { WorkerSchedule } from '../../../../models/appointment-schedule.model.ts';
import type { UserResponse } from '../../../../models/user.model.ts';

import { DayOfWeek } from '../../../../models/enums/day-of-week.ts';
import { buildWorkerSchedule } from './appointment-schedule.ts';

import { formatDateForApi, localDateTimeToISO } from './date.ts';

interface BuildWorkerSchedulesParams {
    workers: UserResponse[];
    workingHours: WorkingHours[];
    appointments: OrganizationAppointmentResponse[];
    timeBlocks: TimeBlockResponse[];
    date: Date;
    timeZone: string;
}

function getWorkingInterval(workingHours: WorkingHours[], date: Date, timeZone: string) {
    const dateString = formatDateForApi(date, timeZone);

    const dayOfWeek = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        timeZone,
    })
        .format(new Date(`${dateString}T12:00:00Z`))
        .toUpperCase() as DayOfWeek;

    const dayWorkingHours = workingHours.find((item) => item.dayOfWeek === dayOfWeek);

    if (!dayWorkingHours?.startTime || !dayWorkingHours.endTime) {
        return null;
    }

    const startAtUTC = localDateTimeToISO(
        `${dateString}T${dayWorkingHours.startTime.slice(0, 5)}`,
        timeZone,
    );

    const endAtUTC = localDateTimeToISO(
        `${dateString}T${dayWorkingHours.endTime.slice(0, 5)}`,
        timeZone,
    );

    const startAt = new Date(startAtUTC);
    const endAt = new Date(endAtUTC);

    if (startAt >= endAt) {
        return null;
    }

    return {
        startAt,
        endAt,
    };
}

export function buildWorkerSchedules({
    workers,
    workingHours,
    appointments,
    timeBlocks,
    date,
    timeZone,
}: BuildWorkerSchedulesParams): WorkerSchedule[] {
    const workingInterval = getWorkingInterval(workingHours, date, timeZone);

    if (!workingInterval) {
        return [];
    }

    const appointmentMap = new Map<string, OrganizationAppointmentResponse[]>();
    const timeBlockMap = new Map<string, TimeBlockResponse[]>();

    for (const appointment of appointments) {
        const existing = appointmentMap.get(appointment.workerUuid);

        if (existing) {
            existing.push(appointment);
        } else {
            appointmentMap.set(appointment.workerUuid, [appointment]);
        }
    }

    for (const timeBlock of timeBlocks) {
        const existing = timeBlockMap.get(timeBlock.requestUserUuid);

        if (existing) {
            existing.push(timeBlock);
        } else {
            timeBlockMap.set(timeBlock.requestUserUuid, [timeBlock]);
        }
    }

    return workers
        .map((worker) =>
            buildWorkerSchedule({
                workerUuid: worker.uuid,
                workerName: `${worker.firstName} ${worker.lastName}`.trim(),
                workingIntervals: [workingInterval],
                appointments: appointmentMap.get(worker.uuid) ?? [],
                timeBlocks: timeBlockMap.get(worker.uuid) ?? [],
            }),
        )
        .sort((a, b) => a.workerName.localeCompare(b.workerName));
}
