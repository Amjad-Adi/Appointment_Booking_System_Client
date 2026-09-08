import { z } from 'zod';
import { InvitationStatus } from '../models/enums/invitation-status.js';
import { inviteUserSchema } from './user.schema.js';
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
