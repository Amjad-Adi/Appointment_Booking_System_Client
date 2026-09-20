import { z } from 'zod';

import { ActivationStatus } from '../models/enums/activation-status.js';
import { Order } from '../models/enums/order.ts';
import { querySchema } from './query.schema.ts';
const SORT_BY_NAME = "name";
const SORT_BY_DAY_DATE = "dayDate";
const SORT_BY_CREATED_AT_UTC = "createdAtUTC";
export const createSpecialDaySchema = z
    .object({
        name: z.string().trim().nonempty('Name is required').max(256),

        dayDate: z.iso.date(),

        description: z.string().trim().nonempty('Description cannot be empty').max(4096).optional(),
    })
    .strict();

export const updateSpecialDaySchema = z
    .object({
        name: z.string().trim().nonempty('Name is required').max(256).optional(),

        dayDate: z.iso.date().optional(),

        description: z.string().trim().nonempty('Description cannot be empty').max(4096).optional(),

        status: z.enum(ActivationStatus).optional(),
    })
    .strict();

export const specialDayFilterSchema = z
    .object({
        organizationUuid: z.uuid('Invalid organization UUID').optional(),

        status: z.enum(ActivationStatus).optional(),

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


export const querySpecialDaySchema = querySchema
    .extend({
        search: z.string().trim().max(256).optional(),

        filter: specialDayFilterSchema.optional(),

        sortBy: z.enum([SORT_BY_NAME, SORT_BY_DAY_DATE, SORT_BY_CREATED_AT_UTC], {
                error: 'Invalid sort field',
            })
            .optional(),
    })
    .strict();