import { z } from 'zod';

import { AppointmentStatus } from '../models/enums/appointment-status.ts';
import { AppointmentTimeType } from '../models/enums/appointment-time-type.ts';
import { PaymentMethod } from '../models/enums/payment-method.ts';
import { PaymentStatus } from '../models/enums/payment-status.ts';

import { querySchema } from './query.schema.ts';

const SORT_BY_SCHEDULED_START_AT_UTC = 'scheduledStartAtUTC';

const SORT_BY_SCHEDULED_END_AT_UTC = 'scheduledEndAtUTC';

const SORT_BY_CREATED_AT_UTC = 'createdAtUTC';

const uuidSchema = z.uuid('Invalid UUID');

const colourSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid colour');

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
        userTitle: z.string().min(1).optional(),

        serviceUuid: uuidSchema,

        timeType: z.enum(AppointmentTimeType),

        workerUuid: uuidSchema,

        scheduledStartAtUTC: z.string().datetime({
            offset: true,
        }),

        userNote: z.string().trim().max(4096).nullable().optional(),

        userColour: colourSchema.optional(),

        paymentMethod: z.enum(PaymentMethod).nullable().optional(),
    })
    .strict();

/*
 * Organization creates an appointment.
 *
 * This is the FINAL API payload.
 *
 * timeType, fromAtUTC and roomUuid are
 * scheduling/form fields and are not sent.
 */
export const createOrganizationAppointmentSchema = z
    .object({
        organizationTitle: z.string().min(1),

        userUuid: uuidSchema,

        serviceUuid: uuidSchema,

        workerUuid: uuidSchema,

        scheduledStartAtUTC: z.string().datetime({
            offset: true,
        }),

        organizationNote: z.string().optional(),

        organizationColour: z.string().optional(),

        paymentMethod: z.enum(PaymentMethod),
    })
    .strict();

/*
 * User updates their appointment.
 */
export const updateAppointmentSchemaByUser = z
    .object({
        userTitle: z.string().min(1).optional(),

        userNote: z.string().trim().max(4096).nullable().optional(),

        userColour: colourSchema.optional(),
    })
    .strict();

/*
 * Organization updates its appointment.
 */
export const updateAppointmentSchemaByOrganization = z
    .object({
        organizationTitle: z.string().min(1).optional(),

        organizationNote: z.string().trim().max(4096).nullable().optional(),

        organizationColour: colourSchema.optional(),
    })
    .strict();

/*
 * Organization confirms an appointment.
 *
 * `name` was removed because appointment name
 * no longer exists in the appointment contract.
 */
export const confirmAppointmentSchema = z
    .object({
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
                SORT_BY_SCHEDULED_START_AT_UTC,
                SORT_BY_SCHEDULED_END_AT_UTC,
                SORT_BY_CREATED_AT_UTC,
            ])
            .optional(),
    })
    .strict();

/*
 * Scheduling/form schema.
 *
 * This is NOT the final API payload.
 */
export const createAppointmentFormSchema = z
    .object({
        organizationTitle: z.string().trim().min(1, 'Appointment title is required.'),

        userUuid: uuidSchema,

        serviceUuid: uuidSchema,

        timeType: z.enum(AppointmentTimeType),

        workerUuid: z.union([uuidSchema, z.literal('')]).optional(),

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
            if (!data.fromAtUTC) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['fromAtUTC'],
                    message: 'Start time is required for nearest availability.',
                });
            }

            /*
             * DO NOT reject workerUuid here.
             *
             * It may contain the worker from the
             * clicked schedule column while the final
             * worker is selected by availability.
             */
        }
    });

export type CreateAppointmentFormInput = z.input<typeof createAppointmentFormSchema>;

export type CreateAppointmentFormOutput = z.output<typeof createAppointmentFormSchema>;
