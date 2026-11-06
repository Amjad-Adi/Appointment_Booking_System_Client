import { z } from 'zod';

import { queryFavouriteSchema } from '../zod-schemas/favourite.schema';
import { ServiceResponse } from './service.model.ts';

export interface FavouriteServiceResponse extends ServiceResponse {
    favouritedAtUTC: string;
}

export type QueryFavourite = z.infer<typeof queryFavouriteSchema> & { offset?: number };
