import { z } from 'zod';
import { querySchema } from './query.schema';
import { AppointmentStatus } from '../models/enums/appointment-status';
import { AppointmentTimeType } from '../models/enums/appointment-time-type';
import { PaymentMethod } from '../models/enums/payment-method';
import { PaymentStatus } from '../models/enums/payment-status';

const SORT_BY_SCHEDULED_START_AT_UTC = 'scheduledStartAtUTC';
const SORT_BY_SCHEDULED_END_AT_UTC = 'scheduledEndAtUTC';
const SORT_BY_CREATED_AT_UTC = 'createdAtUTC';

const uuidSchema = z.uuid({ error: 'Invalid UUID' });

const colourSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, { error: 'Invalid colour' });

export const createAppointmentSchema = z
    .object({
        userTitle: z
            .string()
            .trim()
            .min(1, { error: 'Appointment name is required' })
            .max(256, { error: 'Appointment name must not exceed 256 characters' }),
        serviceUuid: uuidSchema,
        timeType: z.enum(AppointmentTimeType),
        workerUuid: uuidSchema,
        scheduledStartAtUTC: z.iso.datetime({ offset: true }),
        userNote: z
            .string()
            .trim()
            .max(4096, { error: 'Note must not exceed 4096 characters' })
            .nullable()
            .optional(),
        userColour: colourSchema.optional(),
        paymentMethod: z.enum(PaymentMethod).nullable().optional(),
    })
    .strict();

export const createOrganizationAppointmentSchema = z
    .object({
        organizationTitle: z
            .string()
            .trim()
            .min(1, { error: 'Appointment name is required' })
            .max(256, { error: 'Appointment name must not exceed 256 characters' }),
        userUuid: uuidSchema,
        serviceUuid: uuidSchema,
        workerUuid: uuidSchema,
        scheduledStartAtUTC: z.iso.datetime({ offset: true }),
        organizationNote: z
            .string()
            .trim()
            .max(4096, { error: 'Note must not exceed 4096 characters' })
            .nullable()
            .optional(),
        organizationColour: colourSchema.optional(),
        paymentMethod: z.enum(PaymentMethod).optional(),
    })
    .strict();

export const updateAppointmentSchemaByUser = z
    .object({
        userTitle: z
            .string()
            .trim()
            .min(1, { error: 'Appointment name is required' })
            .max(256, { error: 'Appointment name must not exceed 256 characters' })
            .optional(),
        userNote: z
            .string()
            .trim()
            .max(4096, { error: 'Note must not exceed 4096 characters' })
            .nullable()
            .optional(),
        userColour: colourSchema.optional(),
    })
    .strict()
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
        message: 'At least one field must be provided',
    });

export const updateAppointmentSchemaByOrganization = z
    .object({
        organizationTitle: z
            .string()
            .trim()
            .min(1, { error: 'Appointment name is required' })
            .max(256, { error: 'Appointment name must not exceed 256 characters' })
            .optional(),
        organizationNote: z
            .string()
            .trim()
            .max(4096, { error: 'Note must not exceed 4096 characters' })
            .nullable()
            .optional(),
        organizationColour: colourSchema.optional(),
        appointmentStatus: z.enum(AppointmentStatus).optional(),
        rejectionReason: z
            .string()
            .trim()
            .min(1, { error: 'Rejection reason is required' })
            .max(4096, { error: 'Rejection reason must not exceed 4096 characters' })
            .optional(),
        paymentMethod: z.enum(PaymentMethod).optional(),
        paymentStatus: z.enum(PaymentStatus).optional(),
    })
    .strict()
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
        message: 'At least one field must be provided',
    })
    .superRefine((data, ctx) => {
        if (
            data.appointmentStatus === AppointmentStatus.REJECTED &&
            data.rejectionReason === undefined
        ) {
            ctx.addIssue({
                code: 'custom',
                path: ['rejectionReason'],
                message: 'Rejection reason is required',
            });
        }

        if (
            data.appointmentStatus !== AppointmentStatus.REJECTED &&
            data.rejectionReason !== undefined
        ) {
            ctx.addIssue({
                code: 'custom',
                path: ['rejectionReason'],
                message: 'Rejection reason is only allowed when rejecting an appointment',
            });
        }
    });

export const createAppointmentFormSchema = z
    .object({
        organizationTitle: z
            .string()
            .trim()
            .min(1, { error: 'Appointment name is required' })
            .max(256, { error: 'Appointment name must not exceed 256 characters' }),
        userUuid: uuidSchema,
        serviceUuid: uuidSchema,
        timeType: z.enum(AppointmentTimeType),
        workerUuid: z.string().optional(),
        roomUuid: z.string().optional(),
        fromAtUTC: z.string().optional(),
        scheduledStartAtUTC: z
            .string()
            .min(1, { error: 'Please select an available appointment time' }),
        organizationNote: z
            .string()
            .trim()
            .max(4096, { error: 'Note must not exceed 4096 characters' })
            .optional(),
        organizationColour: colourSchema.optional().or(z.literal('')),
        paymentMethod: z.enum(PaymentMethod).optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
        if (!data.scheduledStartAtUTC) {
            ctx.addIssue({
                code: 'custom',
                path: ['scheduledStartAtUTC'],
                message: 'Please select an available appointment time',
            });
        }

        if (data.timeType === AppointmentTimeType.WORKER && !data.workerUuid) {
            ctx.addIssue({
                code: 'custom',
                path: ['workerUuid'],
                message: 'Worker is required',
            });
        }

        if (data.timeType === AppointmentTimeType.NEAREST && !data.fromAtUTC) {
            ctx.addIssue({
                code: 'custom',
                path: ['fromAtUTC'],
                message: 'Start time is required for nearest availability',
            });
        }
    });

export const customerBookingFormSchema = z
    .object({
        userUuid: uuidSchema,
        serviceUuid: uuidSchema,
        userTitle: z
            .string()
            .trim()
            .min(1, { error: 'Appointment name is required' })
            .max(256, { error: 'Appointment name must not exceed 256 characters' }),
        timeType: z.enum(AppointmentTimeType),
        workerUuid: z.string().optional(),
        roomUuid: z.string().optional(),
        fromAtUTC: z.string().optional(),
        scheduledStartAtUTC: z
            .string()
            .min(1, { error: 'Please select an available appointment time' }),
        userNote: z
            .string()
            .trim()
            .max(4096, { error: 'Note must not exceed 4096 characters' })
            .optional(),
        userColour: colourSchema.optional().or(z.literal('')),
        paymentMethod: z.enum(PaymentMethod).optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
        if (!data.scheduledStartAtUTC) {
            ctx.addIssue({
                code: 'custom',
                path: ['scheduledStartAtUTC'],
                message: 'Please select an available appointment time',
            });
        }

        if (data.timeType === AppointmentTimeType.WORKER && !data.workerUuid) {
            ctx.addIssue({
                code: 'custom',
                path: ['workerUuid'],
                message: 'Worker is required',
            });
        }

        if (data.timeType === AppointmentTimeType.NEAREST && !data.fromAtUTC) {
            ctx.addIssue({
                code: 'custom',
                path: ['fromAtUTC'],
                message: 'Start time is required for nearest availability',
            });
        }
    });

export type CreateAppointmentFormInput = z.input<typeof createAppointmentFormSchema>;
export type CreateAppointmentFormOutput = z.output<typeof createAppointmentFormSchema>;
export type CustomerBookingFormInput = z.input<typeof customerBookingFormSchema>;
export type CustomerBookingFormOutput = z.output<typeof customerBookingFormSchema>;

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

        if (
            data.appointmentDate !== undefined &&
            (data.fromDate !== undefined || data.toDate !== undefined)
        ) {
            ctx.addIssue({
                code: 'custom',
                path: ['appointmentDate'],
                message: 'Use appointmentDate or a fromDate/toDate range, not both',
            });
        }
    });

export const queryAppointmentSchema = querySchema
    .extend({
        search: z
            .string()
            .trim()
            .min(1, { error: 'Search cannot be empty' })
            .max(256, { error: 'Search must not exceed 256 characters' })
            .optional(),
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
