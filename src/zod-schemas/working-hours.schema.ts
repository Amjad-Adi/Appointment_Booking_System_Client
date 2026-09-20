import { z } from 'zod';

import { DayOfWeek } from '../models/enums/day-of-week.ts';

import { querySchema } from './query.schema.ts';

const SORT_BY_DAY_OF_WEEK = 'dayOfWeek';
const SORT_BY_START_TIME = 'startTime';
const SORT_BY_END_TIME = 'endTime';

export const timeSchema = z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Invalid time');

export const updateWorkingHoursForm = z
    .object({
        startTime: timeSchema.nullable().optional(),
        endTime: timeSchema.nullable().optional(),
        isClosed: z.boolean()
    })
    .strict()
    .superRefine((data, ctx) => {
        const { startTime, endTime, isClosed } = data;

        // 2. If the day is marked as closed, skip the time validation entirely
        if (isClosed) {
            return;
        }

        if (startTime !== undefined && endTime !== undefined) {
            const startIsSet = startTime !== null;
            const endIsSet = endTime !== null;

            if (startIsSet !== endIsSet) {
                if (!startIsSet) {
                    ctx.addIssue({
                        code: 'custom',
                        path: ['startTime'],
                        message: 'Start time is required when end time is set',
                    });
                }

                if (!endIsSet) {
                    ctx.addIssue({
                        code: 'custom',
                        path: ['endTime'],
                        message: 'End time is required when start time is set',
                    });
                }

                return;
            }

            if (startTime !== null && endTime !== null && startTime >= endTime) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['endTime'],
                    message: 'End time must be after start time',
                });
            }
        }
    });


export const updateWorkingHoursSchema = z
    .object({
        startTime: timeSchema.nullable().optional(),
        endTime: timeSchema.nullable().optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
        const { startTime, endTime } = data;

        if (startTime !== undefined && endTime !== undefined) {
            const startIsSet = startTime !== null;
            const endIsSet = endTime !== null;

            if (startIsSet !== endIsSet) {
                if (!startIsSet) {
                    ctx.addIssue({
                        code: 'custom',
                        path: ['startTime'],
                        message: 'Start time is required when end time is set',
                    });
                }

                if (!endIsSet) {
                    ctx.addIssue({
                        code: 'custom',
                        path: ['endTime'],
                        message: 'End time is required when start time is set',
                    });
                }

                return;
            }

            if (startTime !== null && endTime !== null && startTime >= endTime) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['endTime'],
                    message: 'End time must be after start time',
                });
            }
        }
    });

export const workingHoursFilterSchema = z
    .object({
        organizationUuid: z.uuid('Invalid organization UUID').optional(),

        dayOfWeek: z.enum(DayOfWeek).optional(),
    })
    .strict();

export const queryWorkingHoursSchema = querySchema
    .extend({
        search: z.string().trim().nonempty().max(256).optional(),

        filter: workingHoursFilterSchema.optional(),

        sortBy: z.enum([SORT_BY_DAY_OF_WEEK, SORT_BY_START_TIME, SORT_BY_END_TIME]).optional(),
    })
    .strict();
