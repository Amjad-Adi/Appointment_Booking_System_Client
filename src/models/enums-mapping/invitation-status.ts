import { InvitationStatus } from '../enums/invitation-status.ts';

export const invitationStatusRecord: Record<InvitationStatus, string> = {
    [InvitationStatus.PENDING]: 'Pending',
    [InvitationStatus.ACCEPTED]: 'Accepted',
    [InvitationStatus.EXPIRED]: 'Expired',
    [InvitationStatus.CANCELLED]: 'Cancelled',
};
