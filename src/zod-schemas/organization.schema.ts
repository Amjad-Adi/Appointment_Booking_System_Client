import { z } from 'zod';
import { ActivationStatus } from '../models/enums/activation-status.js';
import { createLocationSchema, updateLocationSchema } from './location.schema.js';
import { querySchema } from './query.schema.ts';

export const SORT_BY_NAME = 'name';
export const SORT_BY_CREATED_AT_UTC = 'createdAtUTC';

export const createOrganizationSchema = z
    .object({
        name: z.string().trim().nonempty().max(256),
        email: z.email(),
        phoneNumber: z.e164(),
        bio: z.string().trim().nonempty().max(4096).optional(),
        location: createLocationSchema,
        profilePicturePath: z.string().trim().nonempty().optional(),
    })
    .strict();

export const updateOrganizationSchema = z
    .object({
        name: z.string().trim().nonempty().max(256).optional(),
        bio: z.string().trim().nonempty().max(4096).optional(),
        phoneNumber: z.e164().optional(),
        location: updateLocationSchema.optional(),
        profilePicturePath: z.string().trim().nonempty().optional(),
        status: z.enum(ActivationStatus).optional(),
    })
    .strict();

export const updateOrganizationByAdminSchema = z
    .object({
        status: z.enum(ActivationStatus).optional(),
    })
    .strict();

export const organizationFilterSchema = z.object({
        status: z.enum(ActivationStatus).optional(),
}).strict();

export const queryOrganizationSchema = querySchema
    .extend({
        search: z.string().trim().nonempty().max(320).optional(),
        filter: organizationFilterSchema.optional(),
        sortBy: z.enum([SORT_BY_NAME, SORT_BY_CREATED_AT_UTC]).optional(),
}).strict();
