import { z } from 'zod';

import {
    createAppointmentSchema,
    createOrganizationAppointmentSchema,
    queryAppointmentSchema,
    updateAppointmentSchemaByOrganization,
    updateAppointmentSchemaByUser,
    updateAppointmentSchemaStatus,
    confirmAppointmentSchema,
    rejectAppointmentSchemaBy,
    payAppointmentSchema,
} from '../zod-schemas/appointment.schema.ts';

import { AppointmentStatus } from './enums/appointment-status.ts';
import { PaymentMethod } from './enums/payment-method.ts';
import { PaymentStatus } from './enums/payment-status.ts';

export interface UserAppointment {
    uuid: string;

    userTitle: string | null;
    userNote: string | null;
    userColour: string;

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

export interface OrganizationAppointment {
    uuid: string;

    organizationTitle: string | null;
    organizationNote: string | null;
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

export interface UserAppointmentResponse extends UserAppointment {
    userUuid: string;
    userName: string;

    organizationUuid: string;
    organizationName: string;

    serviceUuid: string;
    serviceName: string;

    workerUuid: string;
    workerName: string;

    roomUuid: string;
    roomName: string;
}

export interface OrganizationAppointmentResponse extends OrganizationAppointment {
    userUuid: string;
    userName: string;

    organizationUuid: string;
    organizationName: string;

    serviceUuid: string;
    serviceName: string;

    workerUuid: string;
    workerName: string;

    roomUuid: string;
    roomName: string;

    approvalUserUuid: string | null;
    approvalUserName: string | null;
}

export type CreateAppointment = z.infer<typeof createAppointmentSchema>;

export type CreateOrganizationAppointment = z.infer<typeof createOrganizationAppointmentSchema>;

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
