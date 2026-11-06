import type { z } from 'zod';
import { InvitationStatus } from './enums/invitation-status';
import { Role } from './enums/roles';
import {
    acceptInvitationSchema,
    createInvitationSchema,
    queryInvitationSchema,
    updateInvitationByOrganizationSchema,
} from '../zod-schemas/invitations.schema';
import type { DataResponses } from './Query/query.model';

export interface Invitation {
    uuid: string;
    recipientEmail: string;
    role: Role;
    createdAtUTC: string;
    expiresAtUTC: string;
    updatedAtUTC: string;
    status: InvitationStatus;
}

export interface InvitationResponse extends Invitation, DataResponses {
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

export type UpdateInvitation = z.infer<typeof updateInvitationByOrganizationSchema> & {
    uuid: string;
};

export type UpdateInvitationByOrganization = z.infer<
    typeof updateInvitationByOrganizationSchema
> & {
    uuid: string;
    organizationUuid: string;
    userUuid: string;
};

export type AcceptInvitation = z.infer<typeof acceptInvitationSchema> & {
    tokenHash: string;
    uid: string;
    profilePicturePath?: string;
    profilePictureId?: string;
};

export type QueryInvitation = z.infer<typeof queryInvitationSchema> & {
    offset?: number;
    userUuid?: string;
};
