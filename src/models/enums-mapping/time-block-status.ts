import { TimeBlockStatus } from '../enums/time-block-status.ts';

export const timeBlockStatusRecord: Record<TimeBlockStatus, string> = {
    [TimeBlockStatus.APPROVED]: 'Approved',
    [TimeBlockStatus.PENDING]: 'Pending',
    [TimeBlockStatus.REJECTED]: 'Rejected',
    [TimeBlockStatus.DELETED]: 'Deleted',
};
