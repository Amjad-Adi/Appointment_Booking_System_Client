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

/*
 * Customer/User creates an appointment.
 *
 * This is exactly the API request body.
 */
export type CreateAppointment = z.infer<typeof createAppointmentSchema>;

/*
 * Organization creates an appointment.
 *
 * This is exactly the API request body.
 */
export type CreateOrganizationAppointment = z.infer<typeof createOrganizationAppointmentSchema>;

/*
 * User updates their appointment.
 */
export type UpdateAppointmentByUser = z.infer<typeof updateAppointmentSchemaByUser> & {
    uuid: string;
};

/*
 * Organization updates its appointment.
 */
export type UpdateAppointmentByOrganization = z.infer<
    typeof updateAppointmentSchemaByOrganization
> & {
    uuid: string;
};

/*
 * Organization confirms an appointment.
 */
export type ConfirmAppointment = z.infer<typeof confirmAppointmentSchema> & {
    uuid: string;
};

/*
 * Reject appointment.
 */
export type RejectAppointment = z.infer<typeof rejectAppointmentSchemaBy> & {
    uuid: string;
};

/*
 * Update appointment status.
 */
export type UpdateAppointmentStatus = z.infer<typeof updateAppointmentSchemaStatus> & {
    uuid: string;
};

/*
 * Pay appointment.
 */
export type PayAppointment = z.infer<typeof payAppointmentSchema> & {
    uuid: string;
};

/*
 * Appointment query.
 */
export type QueryAppointment = z.infer<typeof queryAppointmentSchema>;
