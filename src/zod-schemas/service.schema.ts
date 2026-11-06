import { z } from 'zod';
import { ActivationStatus } from '../models/enums/activation-status';
export const SORT_BY_NAME = 'name';
export const SORT_BY_CREATED_AT_UTC = 'createdAtUTC';
export const SORT_BY_UPDATED_AT_UTC = 'updatedAtUTC';
export const SORT_BY_PRICE = 'price';
export const SORT_BY_DURATION_IN_MINUTES = 'durationInMinutes';
import { querySchema } from './query.schema';

export const createServiceSchema = z
    .object({
        name: z
            .string()
            .trim()
            .nonempty({ error: 'Service Name is required' })
            .max(256, { error: 'Service Name must be at most 256 characters' }),

        description: z
            .string()
            .trim()
            .nonempty({ error: 'Description cannot be empty' })
            .max(4096, { error: 'Description must be at most 4096 characters' })
            .optional(),

        price: z.coerce
            .number({ error: 'Price must be a number' })
            .positive({ error: 'Price must be greater than 0' }),

        durationInMinutes: z.coerce
            .number({ error: 'Duration must be a number' })
            .int({ error: 'Duration must be an integer' })
            .positive({ error: 'Duration must be greater than 0' }),
    })
    .strict();

export const updateServiceSchema = createServiceSchema
    .partial()
    .extend({
        status: z.enum(ActivationStatus, { error: 'Invalid activation status' }).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length !== 0, {
        message: 'At least one field must be provided',
    });

export const createServiceFormSchema = z
    .object({
        ...createServiceSchema.shape,
        serviceCategoryUuids: z
            .array(z.uuid({ error: 'Invalid service category UUID' }))
            .min(1, { error: 'Select at least one category' }),
    })
    .strict();

export const serviceFilterSchema = z
    .object({
        organizationUuid: z.uuid({ error: 'Invalid organization UUID' }).optional(),

        serviceCategoryUuid: z.uuid({ error: 'Invalid service category UUID' }).optional(),

        minPrice: z.coerce
            .number({ error: 'Minimum price must be a number' })
            .positive({ error: 'Minimum price must be greater than 0' })
            .optional(),

        maxPrice: z.coerce
            .number({ error: 'Maximum price must be a number' })
            .positive({ error: 'Maximum price must be greater than 0' })
            .optional(),

        maxDurationInMinutes: z.coerce
            .number({ error: 'Maximum duration must be a number' })
            .int({ error: 'Maximum duration must be an integer' })
            .positive({ error: 'Maximum duration must be greater than 0' })
            .optional(),

        status: z.enum(ActivationStatus, { error: 'Invalid activation status filter' }).optional(),
    })
    .strict();

export const queryServiceSchema = querySchema
    .extend({
        search: z
            .string()
            .trim()
            .nonempty({ error: 'Search cannot be empty' })
            .max(256, { error: 'Search must be at most 256 characters' })
            .optional(),

        filter: serviceFilterSchema.optional(),

        sortBy: z
            .enum(
                [
                    SORT_BY_NAME,
                    SORT_BY_PRICE,
                    SORT_BY_DURATION_IN_MINUTES,
                    SORT_BY_CREATED_AT_UTC,
                    SORT_BY_UPDATED_AT_UTC,
                ],
                { error: 'Invalid sort field' },
            )
            .optional(),
    })
    .strict();
