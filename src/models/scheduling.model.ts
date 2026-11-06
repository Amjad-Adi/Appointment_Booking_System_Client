import { z } from 'zod';

import { schedulingSchema } from '../zod-schemas/scheduling.schema';

export interface SchedulingWorker {
    uuid: string;
    firstName: string;
    lastName: string;
    profilePicturePath: string | null;
}

export type OrganizationWorker = SchedulingWorker;

export interface SchedulingOption {
    organization: {
        uuid: string;
        name: string;
    };
    service: {
        uuid: string;
        name: string;
        durationInMinutes: number;
    };
    room: {
        uuid: string;
        name: string;
    };
    scheduledStartAtUTC: string;
    scheduledEndAtUTC: string;
}

export interface SchedulingWorkerOptions {
    worker: SchedulingWorker;
    options: SchedulingOption[];
}

export type SchedulingWorkerGroup = SchedulingWorkerOptions;

export interface SchedulingInterval {
    startAtUTC: Date;
    endAtUTC: Date;
}

export interface SchedulingResponse {
    workers: SchedulingWorkerOptions[];
}

export type SchedulingRequest = z.infer<typeof schedulingSchema>;
