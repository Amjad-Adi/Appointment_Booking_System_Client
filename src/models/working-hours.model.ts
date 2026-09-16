import type { z } from 'zod';

import {
    queryWorkingHoursSchema,
    updateWorkingHoursSchema,
} from '../zod-schemas/working-hours.schema.ts';
import { DayOfWeek } from './enums/day-of-week.ts';

export interface WorkingHours {
    uuid: string;
    organizationUuid: string;
    dayOfWeek: DayOfWeek;
    startTime: string | null;
    endTime: string | null;
    createdAtUTC: string;
    updatedAtUTC: string;
}

export type QueryWorkingHours = z.infer<typeof queryWorkingHoursSchema>;

export type UpdateWorkingHours = z.infer<typeof updateWorkingHoursSchema> & {
    uuid: string;
};
