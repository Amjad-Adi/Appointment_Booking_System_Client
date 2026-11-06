import { AppointmentTimeType } from '../enums/appointment-time-type.ts';

export const appointmentTimeTypeRecord: Record<AppointmentTimeType, string> = {
    [AppointmentTimeType.WORKER]: 'Specific worker',
    [AppointmentTimeType.NEAREST]: 'Nearest available',
};
