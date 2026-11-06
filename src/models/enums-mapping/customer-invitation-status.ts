import { CustomerInvitationStatus } from '../enums/customer-invitation-status.ts';

export const customerInvitationStatusRecord: Record<CustomerInvitationStatus, string> = {
    [CustomerInvitationStatus.PENDING]: 'Pending',
    [CustomerInvitationStatus.ACCEPTED]: 'Accepted',
    [CustomerInvitationStatus.REJECTED]: 'Rejected',
    [CustomerInvitationStatus.CANCELLED]: 'Cancelled',
    [CustomerInvitationStatus.EXPIRED]: 'Expired',
};
