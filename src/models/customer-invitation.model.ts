import { z } from 'zod';

import {
    createCustomerInvitationSchema,
    queryCustomerInvitationSchema,
} from '../zod-schemas/customer-invitation.schema';
import { CustomerInvitationStatus } from './enums/customer-invitation-status';
import { DataResponses } from './Query/query.model.ts';

export interface CustomerInvitation {
    uuid: string;
    recipientEmail: string;
    status: CustomerInvitationStatus;
    createdAtUTC: string;
    updatedAtUTC: string;
    expiresAtUTC: string;
    respondedAtUTC: string | null;
}

export interface CustomerInvitationResponse extends CustomerInvitation, DataResponses {
    organizationUuid: string;
    organizationName: string;
    organizationProfilePicturePath: string | null;
    senderUuid: string;
    senderFirstName: string;
    senderLastName: string;
    senderEmail: string;
}

export type CreateCustomerInvitation = z.infer<typeof createCustomerInvitationSchema>;
export type QueryCustomerInvitation = z.infer<typeof queryCustomerInvitationSchema> & {
    offset?: number;
};
