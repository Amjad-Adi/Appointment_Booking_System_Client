import { z } from 'zod';

import { AppointmentStatus } from '../models/enums/appointment-status.ts';
import { AppointmentTimeType } from '../models/enums/appointment-time-type.ts';
import { PaymentMethod } from '../models/enums/payment-method.ts';
import { PaymentStatus } from '../models/enums/payment-status.ts';

import { querySchema } from './query.schema.ts';

const SORT_BY_NAME = 'name';
const SORT_BY_SCHEDULED_START_AT_UTC = 'scheduledStartAtUTC';
const SORT_BY_SCHEDULED_END_AT_UTC = 'scheduledEndAtUTC';
const SORT_BY_CREATED_AT_UTC = 'createdAtUTC';
const SORT_BY_APPOINTMENT_STATUS = 'appointmentStatus';
const SORT_BY_PAYMENT_STATUS = 'paymentStatus';

const uuidSchema = z.uuid('Invalid UUID');

const colourSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid colour');

const appointmentNameSchema = z
    .string()
    .trim()
    .min(1, 'Appointment name is required')
    .max(256, 'Appointment name must not exceed 256 characters');

const scheduledStartSchema = z
    .string()
    .min(1, 'Start time is required')
    .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Invalid start time')
    .transform((value) => new Date(value).toISOString());

const fromAtUTCSchema = z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Invalid start time'));

/*
 * Customer/User creates an appointment.
 */
export const createAppointmentSchema = z
    .object({
        name: appointmentNameSchema,

        serviceUuid: uuidSchema,

        timeType: z.enum(AppointmentTimeType),

        workerUuid: uuidSchema.optional(),

        roomUuid: uuidSchema.optional(),

        scheduledStartAtUTC: scheduledStartSchema,

        userNote: z.string().trim().max(4096).nullable().optional(),

        userColour: colourSchema.optional(),

        paymentMethod: z.enum(PaymentMethod).nullable().optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
        if (data.timeType === AppointmentTimeType.WORKER) {
            if (!data.workerUuid) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['workerUuid'],
                    message: 'Worker UUID is required',
                });
            }

            if (!data.roomUuid) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['roomUuid'],
                    message: 'Room UUID is required',
                });
            }

            return;
        }

        if (data.timeType === AppointmentTimeType.NEAREST) {
            if (data.workerUuid !== undefined) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['workerUuid'],
                    message: 'Worker UUID is not allowed for nearest appointment',
                });
            }

            if (data.roomUuid !== undefined) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['roomUuid'],
                    message: 'Room UUID is not allowed for nearest appointment',
                });
            }
        }
    });

/*
 * Organization creates an appointment.
 *
 * This is the FINAL API payload.
 *
 * timeType and fromAtUTC are not included because they are
 * scheduling-flow fields, not appointment-creation fields.
 */
export const createOrganizationAppointmentSchema = z
    .object({
        name: z.string().min(1),

        userUuid: uuidSchema,

        serviceUuid: uuidSchema,

        timeType: z.enum(AppointmentTimeType),

        workerUuid: uuidSchema.optional(),

        roomUuid: uuidSchema.optional(),

        scheduledStartTimeUTC: z.string().datetime({ offset: true }),

        userNote: z.string().optional(),

        userColour: z.string().optional(),

        paymentMethod: z.enum(PaymentMethod),
    })
    .strict()
    .superRefine((data, ctx) => {
        if (data.timeType === AppointmentTimeType.WORKER) {
            if (!data.workerUuid) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['workerUuid'],
                    message: 'Worker is required.',
                });
            }

            if (!data.roomUuid) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['roomUuid'],
                    message: 'Room is required.',
                });
            }

            return;
        }

        if (data.timeType === AppointmentTimeType.NEAREST) {
            if (data.workerUuid !== undefined) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['workerUuid'],
                    message: 'Worker is not allowed for nearest availability.',
                });
            }

            if (data.roomUuid !== undefined) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['roomUuid'],
                    message: 'Room is not allowed for nearest availability.',
                });
            }
        }
    });
/*
 * User updates their appointment.
 */
export const updateAppointmentSchemaByUser = z
    .object({
        userNote: z.string().trim().max(4096).nullable().optional(),

        userColour: colourSchema.optional(),
    })
    .strict();

/*
 * Organization updates its appointment.
 */
export const updateAppointmentSchemaByOrganization = z
    .object({
        organizationNote: z.string().trim().max(4096).nullable().optional(),

        organizationColour: colourSchema.optional(),
    })
    .strict();

/*
 * Organization confirms an appointment.
 */
export const confirmAppointmentSchema = z
    .object({
        name: appointmentNameSchema,

        organizationColour: colourSchema.optional(),

        organizationNote: z.string().trim().max(4096).nullable().optional(),
    })
    .strict();

/*
 * Reject appointment.
 */
export const rejectAppointmentSchemaBy = z
    .object({
        rejectionReason: z.string().trim().min(1).max(4096),
    })
    .strict();

/*
 * Update appointment status.
 */
export const updateAppointmentSchemaStatus = z
    .object({
        appointmentStatus: z
            .enum(AppointmentStatus)
            .refine(
                (status) =>
                    status !== AppointmentStatus.PENDING_USER_CONFIRMATION &&
                    status !== AppointmentStatus.PENDING_ORGANIZATION_APPROVAL &&
                    status !== AppointmentStatus.REJECTED,
                {
                    message: 'Invalid status transition',
                },
            ),
    })
    .strict();

/*
 * Pay appointment.
 */
export const payAppointmentSchema = z
    .object({
        paymentMethod: z.enum(PaymentMethod),
    })
    .strict();

/*
 * Appointment filters.
 */
export const appointmentFilterSchema = z
    .object({
        organizationUuid: uuidSchema.optional(),

        appointmentStatus: z.enum(AppointmentStatus).optional(),

        appointmentDate: z.iso.date().optional(),

        fromDate: z.iso.date().optional(),

        toDate: z.iso.date().optional(),

        userUuid: uuidSchema.optional(),

        approvalUserUuid: uuidSchema.optional(),

        workerUuid: uuidSchema.optional(),

        serviceUuid: uuidSchema.optional(),

        roomUuid: uuidSchema.optional(),

        paymentMethod: z.enum(PaymentMethod).optional(),

        paymentStatus: z.enum(PaymentStatus).optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
        if (
            data.fromDate !== undefined &&
            data.toDate !== undefined &&
            data.fromDate > data.toDate
        ) {
            ctx.addIssue({
                code: 'custom',
                path: ['toDate'],
                message: 'To date must be after or equal to from date',
            });
        }
    });

/*
 * Appointment query.
 */
export const queryAppointmentSchema = querySchema
    .extend({
        search: z.string().trim().nonempty().max(256).optional(),

        filter: appointmentFilterSchema.optional(),

        sortBy: z
            .enum([
                SORT_BY_NAME,
                SORT_BY_SCHEDULED_START_AT_UTC,
                SORT_BY_SCHEDULED_END_AT_UTC,
                SORT_BY_CREATED_AT_UTC,
                SORT_BY_APPOINTMENT_STATUS,
                SORT_BY_PAYMENT_STATUS,
            ])
            .optional(),
    })
    .strict();

export const createAppointmentFormSchema = z
    .object({
        name: z.string().trim().min(1, 'Appointment name is required.'),

        userUuid: uuidSchema,

        serviceUuid: uuidSchema,

        timeType: z.enum(AppointmentTimeType),

        /*
         * This is allowed to be empty in NEAREST mode because
         * the worker is selected from the scheduling result.
         */
        workerUuid: z.union([uuidSchema, z.literal('')]).optional(),

        /*
         * Room is part of the scheduling result, but is NOT sent
         * to the organization appointment creation API.
         */
        roomUuid: z.union([uuidSchema, z.literal('')]).optional(),

        fromAtUTC: z.string().optional(),

        scheduledStartAtUTC: z.string().min(1, 'Appointment time is required.'),

        organizationNote: z.string().optional(),

        organizationColour: z.string().optional(),

        paymentMethod: z.enum(PaymentMethod),
    })
    .superRefine((data, ctx) => {
        if (data.timeType === AppointmentTimeType.WORKER) {
            if (!data.workerUuid) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['workerUuid'],
                    message: 'Worker is required.',
                });
            }

            if (data.fromAtUTC) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['fromAtUTC'],
                    message: 'Start availability time is not allowed for a specific worker.',
                });
            }

            return;
        }

        if (data.timeType === AppointmentTimeType.NEAREST) {
            /*
             * The scheduling request cannot contain workerUuid.
             * The selected worker is obtained from the availability result.
             */
            if (data.workerUuid) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['workerUuid'],
                    message: 'Worker must not be selected for nearest availability.',
                });
            }

            if (!data.fromAtUTC) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['fromAtUTC'],
                    message: 'Start time is required for nearest availability.',
                });
            }
        }
    });

export type CreateAppointmentFormInput = z.input<typeof createAppointmentFormSchema>;

export type CreateAppointmentFormOutput = z.output<typeof createAppointmentFormSchema>;
