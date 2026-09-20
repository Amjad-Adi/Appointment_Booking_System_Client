import { z } from 'zod';

import {
    updateWorkingHoursSchema,
    queryWorkingHoursSchema,
} from '../zod-schemas/working-hours.schema.ts';

import { DayOfWeek } from './enums/day-of-week.ts';

import type { DataResponses } from './Query/query.model.ts';

export interface WorkingHours {
    uuid: string;

    dayOfWeek: DayOfWeek;

    startTime: string | null;

    endTime: string | null;
}

export interface WorkingHoursResponse extends WorkingHours, DataResponses {
    organizationUuid: string;

    organizationName: string;
}

export type UpdateWorkingHours = z.infer<typeof updateWorkingHoursSchema> & {
    uuid: string;
};


export type QueryWorkingHours = z.infer<typeof queryWorkingHoursSchema>;
