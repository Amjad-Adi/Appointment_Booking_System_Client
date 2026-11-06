import { z } from 'zod';

import { querySchema } from './query.schema';

export const SORT_BY_NAME = 'name';
export const SORT_BY_PRICE = 'price';
export const SORT_BY_FAVOURITED_AT_UTC = 'favouritedAtUTC';

export const createFavouriteSchema = z
    .object({
        serviceUuid: z.uuid({ error: 'Invalid service' }),
    })
    .strict();

export const favouriteFilterSchema = z
    .object({
        serviceCategoryUuid: z.uuid({ error: 'Invalid service category' }).optional(),
    })
    .strict();

export const queryFavouriteSchema = querySchema
    .extend({
        search: z
            .string()
            .trim()
            .max(256, { error: 'Search must be at most 256 characters' })
            .optional(),
        filter: favouriteFilterSchema.optional(),
        sortBy: z
            .enum([SORT_BY_NAME, SORT_BY_PRICE, SORT_BY_FAVOURITED_AT_UTC], {
                error: 'Invalid sort field',
            })
            .optional(),
    })
    .strict();
