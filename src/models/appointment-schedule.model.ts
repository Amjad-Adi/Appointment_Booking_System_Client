import type {
    OrganizationAppointment,
    OrganizationAppointmentResponse,
    UserAppointment,
} from './appointment.model.ts';
import type { TimeBlockResponse } from './time-block.model.ts';

export interface WorkingInterval {
    startAt: Date;
    endAt: Date;
}

export interface WorkerSchedule {
    workerUuid: string;
    workerName: string;
    segments: AppointmentScheduleSegment[];
}

export type AppointmentScheduleSegment =
    | {
          type: 'appointment';
          appointment: OrganizationAppointmentResponse;
      }
    | {
          type: 'time-block';
          timeBlock: TimeBlockResponse;
      }
    | {
          type: 'empty';
          startAt: Date;
          endAt: Date;
      };
