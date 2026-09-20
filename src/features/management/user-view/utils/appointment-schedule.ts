import type { OrganizationAppointmentResponse } from '../../../../models/appointment.model.ts';
import type {
    AppointmentScheduleSegment,
    WorkingInterval,
    WorkerSchedule,
} from '../../../../models/appointment-schedule.model.ts';
import type { TimeBlockResponse } from '../../../../models/time-block.model.ts';
import { TimeBlockStatus } from '../../../../models/enums/time-block-status.ts';

interface WorkerScheduleInput {
    workerUuid: string;
    workerName: string;
    workingIntervals: WorkingInterval[];
    appointments: OrganizationAppointmentResponse[];
    timeBlocks: TimeBlockResponse[];
}

function overlaps(startAt: Date, endAt: Date, otherStartAt: Date, otherEndAt: Date) {
    return otherEndAt > startAt && otherStartAt < endAt;
}

function getTimeBlockIntervals(timeBlocks: TimeBlockResponse[]) {
    return timeBlocks
        .filter((timeBlock) => timeBlock.requestStatus === TimeBlockStatus.APPROVED)
        .map((timeBlock) => ({
            timeBlock,
            startAt: new Date(timeBlock.startAtUTC),
            endAt: new Date(timeBlock.endAtUTC),
        }))
        .sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
}

function buildWorkingIntervalSchedule(
    workingInterval: WorkingInterval,
    appointments: OrganizationAppointmentResponse[],
    timeBlocks: TimeBlockResponse[],
): AppointmentScheduleSegment[] {
    const intervalAppointments = appointments
        .filter((appointment) =>
            overlaps(
                workingInterval.startAt,
                workingInterval.endAt,
                new Date(appointment.scheduledStartAtUTC),
                new Date(appointment.scheduledEndAtUTC),
            ),
        )
        .sort(
            (a, b) =>
                new Date(a.scheduledStartAtUTC).getTime() -
                new Date(b.scheduledStartAtUTC).getTime(),
        );

    const intervalTimeBlocks = getTimeBlockIntervals(timeBlocks).filter(({ startAt, endAt }) =>
        overlaps(workingInterval.startAt, workingInterval.endAt, startAt, endAt),
    );

    const boundaries: Date[] = [new Date(workingInterval.startAt), new Date(workingInterval.endAt)];

    for (const appointment of intervalAppointments) {
        boundaries.push(
            new Date(appointment.scheduledStartAtUTC),
            new Date(appointment.scheduledEndAtUTC),
        );
    }

    for (const { startAt, endAt } of intervalTimeBlocks) {
        boundaries.push(new Date(startAt), new Date(endAt));
    }

    boundaries.sort((a, b) => a.getTime() - b.getTime());

    const segments: AppointmentScheduleSegment[] = [];

    for (let index = 0; index < boundaries.length - 1; index++) {
        const rawStart = boundaries[index];
        const rawEnd = boundaries[index + 1];

        if (rawStart >= rawEnd) {
            continue;
        }

        const startAt =
            rawStart < workingInterval.startAt
                ? new Date(workingInterval.startAt)
                : new Date(rawStart);

        const endAt =
            rawEnd > workingInterval.endAt ? new Date(workingInterval.endAt) : new Date(rawEnd);

        if (startAt >= endAt) {
            continue;
        }

        const appointment = intervalAppointments.find((item) => {
            const appointmentStart = new Date(item.scheduledStartAtUTC);
            const appointmentEnd = new Date(item.scheduledEndAtUTC);

            return appointmentStart <= startAt && appointmentEnd >= endAt;
        });

        if (appointment) {
            const alreadyAdded = segments.some(
                (segment) =>
                    segment.type === 'appointment' && segment.appointment.uuid === appointment.uuid,
            );

            if (!alreadyAdded) {
                segments.push({
                    type: 'appointment',
                    appointment,
                });
            }

            continue;
        }

        const timeBlock = intervalTimeBlocks.find(
            ({ startAt: blockStart, endAt: blockEnd }) =>
                blockStart <= startAt && blockEnd >= endAt,
        );

        if (timeBlock) {
            const alreadyAdded = segments.some(
                (segment) =>
                    segment.type === 'time-block' &&
                    segment.timeBlock.uuid === timeBlock.timeBlock.uuid,
            );

            if (!alreadyAdded) {
                segments.push({
                    type: 'time-block',
                    timeBlock: timeBlock.timeBlock,
                });
            }

            continue;
        }

        segments.push({
            type: 'empty',
            startAt,
            endAt,
        });
    }

    return mergeAdjacentEmptySegments(segments);
}

export function buildWorkerSchedule({
    workerUuid,
    workerName,
    workingIntervals,
    appointments,
    timeBlocks,
}: WorkerScheduleInput): WorkerSchedule {
    return {
        workerUuid,
        workerName,
        segments: workingIntervals.flatMap((workingInterval) =>
            buildWorkingIntervalSchedule(workingInterval, appointments, timeBlocks),
        ),
    };
}

function mergeAdjacentEmptySegments(
    segments: AppointmentScheduleSegment[],
): AppointmentScheduleSegment[] {
    const result: AppointmentScheduleSegment[] = [];

    for (const segment of segments) {
        const previous = result[result.length - 1];

        if (
            previous?.type === 'empty' &&
            segment.type === 'empty' &&
            previous.endAt.getTime() === segment.startAt.getTime()
        ) {
            previous.endAt = new Date(segment.endAt);
            continue;
        }

        result.push(segment);
    }

    return result;
}
