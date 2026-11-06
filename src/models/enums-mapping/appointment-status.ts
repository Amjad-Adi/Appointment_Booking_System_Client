import { AppointmentStatus } from '../enums/appointment-status.ts';

export const appointmentStatusRecord: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING_USER_CONFIRMATION]: 'Pending your confirmation',
    [AppointmentStatus.PENDING_ORGANIZATION_APPROVAL]: 'Pending approval',
    [AppointmentStatus.CONFIRMED]: 'Confirmed',
    [AppointmentStatus.REJECTED]: 'Rejected',
    [AppointmentStatus.CANCELLED]: 'Cancelled',
    [AppointmentStatus.IN_PROGRESS]: 'In progress',
    [AppointmentStatus.COMPLETED]: 'Completed',
    [AppointmentStatus.NO_SHOW]: 'No show',
};
