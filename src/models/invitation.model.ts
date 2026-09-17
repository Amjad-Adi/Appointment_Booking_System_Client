import { z } from 'zod';

import { InvitationStatus } from './enums/invitation-status.ts';

import {
    createInvitationSchema,
    queryInvitationSchema,
    updateInvitationSchema,
} from '../zod-schemas/invitations.schema.ts';

export interface Invitation {
    uuid: string;
    createdAtUTC: Date;
    expiresAtUTC: Date;
    invitationStatus: InvitationStatus;
}

export interface InvitationResponse extends Invitation {
    senderUuid: string;
    senderFirstName: string;
    senderLastName: string;
    senderEmail: string;
    senderProfilePicturePath: string;
    organizationUuid: string;
    organizationName: string;
    recipientUuid: string;
    recipientFirstName: string;
    recipientLastName: string;
    recipientEmail: string;
    recipientProfilePicturePath: string;
}

export type CreateInvitation = z.infer<typeof createInvitationSchema>;

export type UpdateInvitation = z.infer<typeof updateInvitationSchema>;

export type QueryInvitation = z.infer<typeof queryInvitationSchema>;
