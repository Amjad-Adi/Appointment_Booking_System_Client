import type { AppointmentResponse } from '../../../../models/appointment.model.ts';
import type { WorkingHours } from '../../../../models/working-hours.model.ts';
import type { TimeBlockResponse } from '../../../../models/time-block.ts';
import type { WorkerSchedule } from '../../../../models/appointment-schedule.model.ts';

import { DayOfWeek } from '../../../../models/enums/day-of-week.ts';
import { buildWorkerSchedule } from './appointment-schedule.ts';

import { formatDateForApi, localDateTimeToISO } from './date.ts';

interface BuildWorkerSchedulesParams {
    workingHours: WorkingHours[];
    appointments: AppointmentResponse[];
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

    const workerMap = new Map<
        string,
        {
            workerName: string;
            appointments: AppointmentResponse[];
            timeBlocks: TimeBlockResponse[];
        }
    >();

    for (const appointment of appointments) {
        const existing = workerMap.get(appointment.workerUuid);

        if (existing) {
            existing.appointments.push(appointment);
        } else {
            workerMap.set(appointment.workerUuid, {
                workerName: appointment.workerName,
                appointments: [appointment],
                timeBlocks: [],
            });
        }
    }

    for (const timeBlock of timeBlocks) {
        const existing = workerMap.get(timeBlock.requestUserUuid);

        const workerName = [timeBlock.requestUserFirstName, timeBlock.requestUserLastName]
            .filter(Boolean)
            .join(' ');

        if (existing) {
            existing.timeBlocks.push(timeBlock);
        } else {
            workerMap.set(timeBlock.requestUserUuid, {
                workerName,
                appointments: [],
                timeBlocks: [timeBlock],
            });
        }
    }

    return Array.from(workerMap.entries())
        .map(([workerUuid, worker]) =>
            buildWorkerSchedule({
                workerUuid,
                workerName: worker.workerName,
                workingIntervals: [workingInterval],
                appointments: worker.appointments,
                timeBlocks: worker.timeBlocks,
            }),
        )
        .sort((a, b) => a.workerName.localeCompare(b.workerName));
}
