import type { z } from 'zod';
import { createLocationSchema, updateLocationSchema } from '../zod-schemas/location.schema';

export interface LocationResponse {
    name: string | null;
    readonly locationOnMap: [longitude: number | null, latitude: number | null];
    timezone: string;
    createdAtUTC: string | null;
    updatedAtUTC: string | null;
}

export interface Location {
    id: number;
    name: string;
    readonly locationOnMap: [longitude: number, latitude: number];
    timezone: string;
    createdAtUTC: string;
    updatedAtUTC: string;
}

export type CreateLocation = z.infer<typeof createLocationSchema>;

export type UpdateLocation = z.infer<typeof updateLocationSchema> & {
    id: number;
};
