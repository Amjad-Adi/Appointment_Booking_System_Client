import type { AppointmentResponse } from '../../../../models/appointment.model.ts';
import type { WorkingHours } from '../../../../models/working-hours.model.ts';
import type { TimeBlockResponse } from '../../../../models/time-block.ts';
import type { WorkerSchedule } from '../../../../models/appointment-schedule.model.ts';

import { buildWorkerSchedule } from './appointment-schedule.ts';

interface BuildWorkerSchedulesParams {
    workingHours: WorkingHours[];
    appointments: AppointmentResponse[];
    timeBlocks: TimeBlockResponse[];
    date: Date;
}

function normalize(value: string) {
    return value.trim().toLowerCase();
}

function getDayOfWeekName(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
    }).format(date);
}

function getWorkingInterval(workingHours: WorkingHours[], date: Date) {
    const dayName = normalize(getDayOfWeekName(date));

    const dayWorkingHours = workingHours.find(
        (item) => normalize(String(item.dayOfWeek)) === dayName,
    );

    if (!dayWorkingHours?.startTime || !dayWorkingHours.endTime) {
        return null;
    }

    const [startHour, startMinute] = dayWorkingHours.startTime.split(':').map(Number);

    const [endHour, endMinute] = dayWorkingHours.endTime.split(':').map(Number);

    const startAt = new Date(date);
    startAt.setHours(startHour, startMinute, 0, 0);

    const endAt = new Date(date);
    endAt.setHours(endHour, endMinute, 0, 0);

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
}: BuildWorkerSchedulesParams): WorkerSchedule[] {
    const workingInterval = getWorkingInterval(workingHours, date);

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
