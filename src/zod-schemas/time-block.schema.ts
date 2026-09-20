import { z } from 'zod';

import { TimeBlockStatus } from '../models/enums/time-block-status.js';
import { querySchema } from './query.schema.ts';
const COLUMN_ORGANIZATION_ID = 'organization_id';
const SORT_BY_START_AT_UTC = 'startAtUTC';
const SORT_BY_END_AT_UTC = 'endAtUTC';
const SORT_BY_REQUESTED_AT_UTC = 'requestedAtUTC';
const SORT_BY_RESPONDED_AT_UTC = 'respondedAtUTC';
const SORT_BY_REQUEST_STATUS = 'requestStatus';

export const createTimeBlockSchema = z
    .object({
        reason: z.string().trim().nonempty('Reason is required').max(4096),

        startAtUTC: z.iso.datetime({
            offset: true,
        }),

        endAtUTC: z.iso.datetime({
            offset: true,
        }),
    })
    .strict()
    .superRefine((data, ctx) => {
        if (data.startAtUTC >= data.endAtUTC) {
            ctx.addIssue({
                code: 'custom',
                path: ['endAtUTC'],
                message: 'End time must be after start time',
            });
        }
    });

export const updateTimeBlockSchema = z
    .object({
        requestStatus: z.enum(TimeBlockStatus),
    })
    .strict();

export const timeBlockFilterSchema = z
    .object({
        organizationUuid: z.uuid('Invalid organization UUID').optional(),

        requestStatus: z.enum(TimeBlockStatus).optional(),

        requestUserUuid: z.uuid('Invalid request user UUID').optional(),

        respondUserUuid: z.uuid('Invalid response user UUID').optional(),

        fromDate: z.iso.date().optional(),

        toDate: z.iso.date().optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
        if (
            data.fromDate !== undefined &&
            data.toDate !== undefined &&
            data.fromDate > data.toDate
        ) {
            ctx.addIssue({
                code: 'custom',
                path: ['toDate'],
                message: 'To date must be after or equal to from date',
            });
        }
    });


export const queryTimeBlockSchema = querySchema
    .extend({
        search: z.string().trim().max(256).optional(),
        filter: timeBlockFilterSchema.optional(),
        sortBy: z.enum([
            SORT_BY_START_AT_UTC,
            SORT_BY_END_AT_UTC,
            SORT_BY_REQUESTED_AT_UTC,
            SORT_BY_RESPONDED_AT_UTC,
            SORT_BY_REQUEST_STATUS,
        ]),
    })
    .strict();