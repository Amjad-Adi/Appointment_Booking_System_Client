import { z } from 'zod';

import { querySchema } from './query.schema';

export const SORT_BY_CREATED_AT_UTC = 'createdAtUTC';
export const SORT_BY_UPDATED_AT_UTC = 'updatedAtUTC';
export const SORT_BY_RATING = 'rating';

export const createReviewSchema = z
    .object({
        appointmentUuid: z.uuid({ error: 'Invalid appointment' }),
        rating: z.coerce
            .number({ error: 'Rating is required' })
            .int({ error: 'Rating must be a whole number' })
            .min(1, { error: 'Rating must be at least 1' })
            .max(5, { error: 'Rating must be at most 5' }),
        comment: z
            .string()
            .trim()
            .min(3, { error: 'Comment must be at least 3 characters' })
            .max(4096, { error: 'Comment must be at most 4096 characters' }),
    })
    .strict();

export const updateReviewSchema = z
    .object({
        rating: z.coerce
            .number({ error: 'Rating must be a number' })
            .int({ error: 'Rating must be a whole number' })
            .min(1, { error: 'Rating must be at least 1' })
            .max(5, { error: 'Rating must be at most 5' })
            .optional(),
        comment: z
            .string()
            .trim()
            .min(3, { error: 'Comment must be at least 3 characters' })
            .max(4096, { error: 'Comment must be at most 4096 characters' })
            .optional(),
    })
    .strict()
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
        message: 'At least one field must be provided',
    });

export const reviewFilterSchema = z
    .object({
        serviceUuid: z.uuid({ error: 'Invalid service UUID' }).optional(),
        organizationUuid: z.uuid({ error: 'Invalid organization UUID' }).optional(),
        appointmentUuid: z.uuid({ error: 'Invalid appointment UUID' }).optional(),
        rating: z.coerce.number().int().min(1).max(5).optional(),
    })
    .strict();

export const queryReviewSchema = querySchema
    .extend({
        search: z
            .string()
            .trim()
            .max(320, { error: 'Search must be at most 320 characters' })
            .optional(),
        filter: reviewFilterSchema.optional(),
        sortBy: z
            .enum([SORT_BY_CREATED_AT_UTC, SORT_BY_UPDATED_AT_UTC, SORT_BY_RATING], {
                error: 'Invalid sort field',
            })
            .optional(),
    })
    .strict();
