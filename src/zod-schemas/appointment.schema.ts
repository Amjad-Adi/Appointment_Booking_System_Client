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
    .transform((value) => new Date(value).toISOString());

/*
 * Customer/User creates an appointment.
 *
 * The customer explicitly provides:
 * - appointment name
 * - service
 * - time type
 * - worker when using WORKER scheduling
 * - room when using WORKER scheduling
 * - scheduled start time
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
 * The organization explicitly provides:
 * - appointment name
 * - customer
 * - service
 * - worker
 * - scheduled start time
 *
 * The room is NOT provided by the organization.
 *
 * The backend resolves the room assigned to the selected worker
 * and revalidates that the room is available for the requested interval.
 *
 * timeType is also NOT part of the final organization-create payload.
 * It is only used by the scheduling flow to determine how the worker
 * and available time are selected.
 */
export const createOrganizationAppointmentSchema = z
    .object({
        name: appointmentNameSchema,

        userUuid: uuidSchema,

        serviceUuid: uuidSchema,

        workerUuid: z
            .string()
            .transform((value) => value || undefined)
            .optional(),
        scheduledStartAtUTC: scheduledStartSchema,

        organizationNote: z.string().trim().max(4096).nullable().optional(),

        organizationColour: colourSchema.optional(),

        paymentMethod: z.enum(PaymentMethod).nullable().optional(),
    })
    .strict();

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

/*
 * Organization appointment form schema.
 *
 * This is the FRONTEND form schema.
 *
 * It intentionally differs from createOrganizationAppointmentSchema
 * because the scheduling UI needs timeType to determine how to find
 * an available appointment.
 *
 * For NEAREST:
 * - workerUuid can initially be empty
 * - scheduling returns a worker
 * - the selected worker is then placed into the form
 *
 * For WORKER:
 * - workerUuid is required
 *
 * This schema is not the final API payload schema.*/
export const createAppointmentFormSchema = z
    .object({
        name: appointmentNameSchema,

        userUuid: uuidSchema,

        serviceUuid: uuidSchema,

        timeType: z.enum(AppointmentTimeType),

        workerUuid: z.union([uuidSchema, z.literal('')]).optional(),

        /*
         * Search starting point.
         *
         * Required by the UI for NEAREST.
         *
         * For WORKER this comes from the calendar
         * selection and is not manually edited.
         */
        fromAtUTC: z.string().optional(),

        /*
         * Actual appointment time returned by
         * the scheduling endpoint.
         */
        scheduledStartAtUTC: scheduledStartSchema,

        organizationNote: z.string().trim().max(4096).nullable().optional(),

        organizationColour: colourSchema.optional(),

        paymentMethod: z.enum(PaymentMethod).nullable().optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
        const workerUuid = data.workerUuid === '' ? undefined : data.workerUuid;

        if (data.timeType === AppointmentTimeType.WORKER) {
            if (!workerUuid) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['workerUuid'],
                    message: 'Worker is required when using specific worker availability.',
                });
            }
        }

        if (data.timeType === AppointmentTimeType.NEAREST) {
            if (!data.fromAtUTC) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['fromAtUTC'],
                    message: 'Start time is required when using nearest availability.',
                });
            }

            if (workerUuid) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['workerUuid'],
                    message: 'Worker must not be selected when using nearest availability.',
                });
            }
        }
    });

export type CreateAppointmentFormInput = z.input<typeof createAppointmentFormSchema>;

export type CreateAppointmentFormOutput = z.output<typeof createAppointmentFormSchema>;
