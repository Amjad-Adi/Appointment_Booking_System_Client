import { z } from 'zod';

import type { InvitationStatus } from './enums/invitation-status.ts';
import type { Role } from './enums/roles.ts';

import {
    createInvitationSchema,
    queryInvitationSchema,
    updateInvitationSchema,
} from '../zod-schemas/invitations.schema.ts';

export interface Invitation {
    uuid: string;
    recipientEmail: string;
    role: Role;
    createdAtUTC: string;
    expiresAtUTC: string;
    acceptedAtUTC: string | null;
    status: InvitationStatus;
}

export interface InvitationResponse extends Invitation {
    senderUuid: string;
    senderFirstName: string;
    senderLastName: string;
    senderEmail: string;
    senderProfilePicturePath: string | null;

    organizationUuid: string;
    organizationName: string;
    organizationProfilePicturePath: string | null;
}

export type CreateInvitation = z.infer<typeof createInvitationSchema>;

export type UpdateInvitation = z.infer<typeof updateInvitationSchema>;

export type QueryInvitation = z.infer<typeof queryInvitationSchema>;
