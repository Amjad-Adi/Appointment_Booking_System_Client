import { z } from 'zod';
import { InvitationStatus } from '../models/enums/invitation-status.js';
import { inviteUserSchema } from './user.schema.js';
import { Order } from '../models/enums/order.ts';
import { ActivationStatus } from '../models/enums/activation-status.ts';
import { RoomOccupancyStatus } from '../models/enums/room-occupancy-status.ts';
import { querySchema } from './query.schema.ts';

export const SORT_BY_EXPIRES_AT_UC = 'expiresAtUTC';
export const SORT_BY_CREATED_AT_UTC = 'createdAtUTC';

export const createInvitationSchema = inviteUserSchema
    .extend({
        expiresAtUTC: z.iso.datetime({ offset: true }),
    })
    .strict();

export const updateInvitationSchema = z
    .object({
        status: z.enum(InvitationStatus).optional(),
    })
    .strict();

export const invitationFilterSchema = z
    .object({
        status: z.enum(InvitationStatus).optional(),
    })
    .strict();

export const queryInvitationSchema = querySchema.extend({
    search: z.string().optional(),
    filter: invitationFilterSchema.optional(),
    sortBy: z.enum(['createdAtUTC', 'expiresAtUTC']).optional(),
});
