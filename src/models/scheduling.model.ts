import type { z } from 'zod';

import type { schedulingSchema } from '../zod-schemas/scheduling.schema.ts';

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

    worker: {
        uuid: string;
        firstName: string;
        lastName: string;
        profilePicturePath: string;
    };

    room: {
        uuid: string;
        name: string;
    };

    scheduledStartAtUTC: string;
    scheduledEndAtUTC: string;
}

export interface SchedulingResponse {
    options: SchedulingOption[];
}

export type SchedulingRequest = z.infer<typeof schedulingSchema>;
