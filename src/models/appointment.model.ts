import { z } from 'zod';

import {
    createAppointmentSchema,
    queryAppointmentSchema,
    updateAppointmentSchemaByOrganization,
    updateAppointmentSchemaByUser,
    updateAppointmentSchemaStatus,
    confirmAppointmentSchema,
    rejectAppointmentSchemaBy,
    payAppointmentSchema,
    createOrganizationAppointmentSchema,
} from '../zod-schemas/appointment.schema.ts';

import { AppointmentStatus } from './enums/appointment-status.ts';
import { AppointmentTimeType } from './enums/appointment-time-type.ts';
import { PaymentMethod } from './enums/payment-method.ts';
import { PaymentStatus } from './enums/payment-status.ts';

import type { DataResponses } from './Query/query.model.ts';

export interface Appointment {
    uuid: string;
    name: string;

    userUuid: string;
    organizationUuid: string;
    serviceUuid: string;
    workerUuid: string;
    roomUuid: string;
    approvalUserUuid: string | null;

    userTitle: string | null;
    organizationTitle: string | null;

    userNote: string | null;
    organizationNote: string | null;

    userColour: string;
    organizationColour: string;

    scheduledStartAtUTC: string;
    scheduledEndAtUTC: string;

    actualStartAtUTC: string | null;
    actualEndAtUTC: string | null;

    appointmentStatus: AppointmentStatus;
    rejectionReason: string | null;

    paymentMethod: PaymentMethod | null;
    paymentStatus: PaymentStatus;
    paidAtUTC: string | null;

    createdAtUTC: string;
    updatedAtUTC: string;
}

export interface AppointmentResponse extends Appointment, DataResponses {
    userName: string;
    organizationName: string;
    serviceName: string;
    workerName: string;
    roomName: string;
    approvalUserName: string | null;
}

export type CreateAppointment = z.infer<typeof createAppointmentSchema>;

export type UpdateAppointmentByUser = z.infer<typeof updateAppointmentSchemaByUser> & {
    uuid: string;
};

export type UpdateAppointmentByOrganization = z.infer<
    typeof updateAppointmentSchemaByOrganization
> & {
    uuid: string;
};

export type ConfirmAppointment = z.infer<typeof confirmAppointmentSchema> & {
    uuid: string;
};

export type RejectAppointment = z.infer<typeof rejectAppointmentSchemaBy> & {
    uuid: string;
};

export type UpdateAppointmentStatus = z.infer<typeof updateAppointmentSchemaStatus> & {
    uuid: string;
};

export type PayAppointment = z.infer<typeof payAppointmentSchema> & {
    uuid: string;
};

export type QueryAppointment = z.infer<typeof queryAppointmentSchema>;
export type CreateOrganizationAppointment = z.infer<typeof createOrganizationAppointmentSchema>;
