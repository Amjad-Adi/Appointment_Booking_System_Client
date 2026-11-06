import type { DayOfWeek } from './enums/day-of-week';
import {
    queryWorkingHoursSchema,
    updateDayWorkingHoursSchema,
} from '../zod-schemas/working-hours.schema';
import { z } from 'zod';
import { DataResponses } from './Query/query.model.ts';

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

export type UpdateDayWorkingHours = z.infer<typeof updateDayWorkingHoursSchema> & {
    uuid: string;
};

export type UpdateWorkingHours = UpdateDayWorkingHours;

export type QueryWorkingHours = z.infer<typeof queryWorkingHoursSchema> & { offset?: number };
