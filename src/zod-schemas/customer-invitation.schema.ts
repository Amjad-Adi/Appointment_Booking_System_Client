import { z } from 'zod';

import { CustomerInvitationStatus } from '../models/enums/customer-invitation-status';
import { querySchema } from './query.schema';

export const SORT_BY_CREATED_AT_UTC = 'createdAtUTC';
export const SORT_BY_UPDATED_AT_UTC = 'updatedAtUTC';
export const SORT_BY_EXPIRES_AT_UTC = 'expiresAtUTC';

export const createCustomerInvitationSchema = z
    .object({
        recipientEmail: z.email({ error: 'Invalid email address' }),
    })
    .strict();

export const customerInvitationFilterSchema = z
    .object({
        status: z
            .enum(CustomerInvitationStatus, { error: 'Invalid invitation status' })
            .optional(),
    })
    .strict();

export const queryCustomerInvitationSchema = querySchema
    .extend({
        search: z
            .string()
            .trim()
            .max(320, { error: 'Search must be at most 320 characters' })
            .optional(),
        filter: customerInvitationFilterSchema.optional(),
        sortBy: z
            .enum([SORT_BY_CREATED_AT_UTC, SORT_BY_UPDATED_AT_UTC, SORT_BY_EXPIRES_AT_UTC], {
                error: 'Invalid sort field',
            })
            .optional(),
    })
    .strict();
