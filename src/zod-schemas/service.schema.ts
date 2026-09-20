import { z } from 'zod';
import { ActivationStatus } from '../models/enums/activation-status.js';
import { querySchema } from './query.schema.js';

const SORT_BY_NAME = 'name';
const SORT_BY_CREATED_AT_UTC = 'createdAtUTC';
const SORT_BY_PRICE = 'price';
const SORT_BY_DURATION_IN_MINUTES = 'durationInMinutes';

export const createServiceSchema = z
    .object({
        name: z
            .string()
            .trim()
            .nonempty('Name is required')
            .max(256, 'Name must not exceed 256 characters'),
        description: z
            .string()
            .trim()
            .max(4096, 'Description must not exceed 4096 characters')
            .transform((value) => (value === '' ? null : value))
            .nullable()
            .optional(),
        price: z.coerce
            .number('Price must be a number')
            .min(0, 'Price cannot be negative')
            .optional(),
        durationInMinutes: z.coerce
            .number('Duration must be a number')
            .int('Duration must be a whole number')
            .positive('Duration must be greater than 0'),
        profilePicturePath: z.string().trim().optional(),
    })
    .strict();

export const createServiceFormSchema = createServiceSchema.extend({
    serviceCategoryUuids: z.array(z.string().uuid()).min(1, 'Select at least one category'),
});

export const updateServiceSchema = createServiceSchema
    .partial()
    .extend({
        status: z.enum(ActivationStatus, { error: 'Invalid activation status' }).optional(),
    })
    .strict();

export const serviceFilterSchema = z
    .object({
        organizationUuid: z.uuid('Invalid organization UUID').optional(),
        serviceCategoryUuid: z.uuid('Invalid service category UUID').optional(),
        minPrice: z.coerce
            .number('Minimum price must be a number')
            .min(0, 'Minimum price cannot be negative')
            .optional(),
        maxPrice: z.coerce
            .number('Maximum price must be a number')
            .min(0, 'Maximum price cannot be negative')
            .optional(),
        maxDurationInMinutes: z.coerce
            .number('Maximum duration must be a number')
            .int('Maximum duration must be a whole number')
            .positive('Maximum duration must be greater than 0')
            .optional(),

        status: z.enum(ActivationStatus, { error: 'Invalid activation status' }).optional(),
    })
    .strict();

export const queryServiceSchema = querySchema
    .extend({
        search: z
            .string()
            .trim()
            .nonempty('Search cannot be empty')
            .max(256, 'Search must not exceed 256 characters')
            .optional(),
        filter: serviceFilterSchema.optional(),
        sortBy: z
            .enum(
                [SORT_BY_NAME, SORT_BY_PRICE, SORT_BY_DURATION_IN_MINUTES, SORT_BY_CREATED_AT_UTC],
                { error: 'Invalid sort field' },
            )
            .optional(),
    })
    .strict();
