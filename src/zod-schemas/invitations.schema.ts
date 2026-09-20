import { z } from 'zod';

import { Role } from '../models/enums/roles.ts';
import { InvitationStatus } from '../models/enums/invitation-status.ts';
import { querySchema } from './query.schema.ts';

export const createInvitationSchema = z
    .object({
        email: z.string().trim().toLowerCase().email({ message: 'Invalid email address' }),

        role: z.enum([Role.OWNER, Role.MANAGER, Role.CRM, Role.WORKER], {
            message: 'Invalid invitation role',
        }),

        expiresAtUTC: z.string().min(1, { message: 'Expiration date is required' }),
    })
    .strict();

export const updateInvitationSchema = z
    .object({
        status: z.enum([InvitationStatus.CANCELLED, InvitationStatus.EXPIRED]).optional(),
    })
    .strict();

export const invitationFilterSchema = z
    .object({
        organizationUuid: z.string().uuid().optional(),
        status: z.enum(InvitationStatus).optional(),
    })
    .strict();

export const queryInvitationSchema = querySchema
    .extend({
        search: z.string().trim().max(320).optional(),

        filter: invitationFilterSchema.optional(),

        sortBy: z.enum(['createdAtUTC', 'expiresAtUTC']).optional(),
    })
    .strict();
