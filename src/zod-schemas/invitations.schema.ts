import { z } from 'zod';
import { Role } from '../models/enums/roles';
import { InvitationStatus } from '../models/enums/invitation-status';
import { querySchema } from './query.schema';

const SORT_BY_CREATED_AT_UTC = 'createdAtUTC';
const SORT_BY_EXPIRES_AT_UTC = 'expiresAtUTC';
const SORT_BY_UPDATED_AT_UTC = 'updatedAtUTC';

const expiresAtUTCSchema = z
    .string()
    .trim()
    .nonempty({ error: 'Invitation expiration is required' })
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
        error: 'Invalid invitation expiration date',
    })
    .transform((value) => new Date(value).toISOString())
    .refine((value) => new Date(value).getTime() > Date.now(), {
        error: 'Invitation expiration must be in the future',
    });

export const createInvitationSchema = z
    .object({
        recipientEmail: z.email({ error: 'Invalid email address' }),
        role: z.enum([Role.OWNER, Role.MANAGER, Role.CRM, Role.WORKER], {
            error: 'Invalid invitation role',
        }),
        expiresAtUTC: expiresAtUTCSchema,
    })
    .strict();

export const updateInvitationByOrganizationSchema = z
    .object({
        expiresAtUTC: expiresAtUTCSchema.optional(),
        status: z
            .enum([InvitationStatus.CANCELLED], { error: 'Invalid invitation status' })
            .optional(),
    })
    .strict()
    .refine(
        (data) => (data.expiresAtUTC ? new Date(data.expiresAtUTC).getTime() > Date.now() : true),
        {
            message: 'Invitation expiration must be in the future',
            path: ['expiresAtUTC'],
        },
    )
    .refine((data) => Object.keys(data).length !== 0, {
        message: 'At least one field must be provided',
    });

export const acceptInvitationSchema = z
    .object({
        firstName: z
            .string()
            .trim()
            .nonempty({ error: 'First Name is required' })
            .max(64, { error: 'First Name must be at most 64 characters' }),
        lastName: z
            .string()
            .trim()
            .nonempty({ error: 'Last Name is required' })
            .max(64, { error: 'Last Name must be at most 64 characters' }),
        password: z
            .string()
            .trim()
            .nonempty({ error: 'Password is required' })
            .min(8, { error: 'Password must be at least 8 characters' })
            .max(64, { error: 'Password must be at most 64 characters' }),
        confirmPassword: z
            .string()
            .trim()
            .nonempty({ error: 'Confirm Password is required' })
            .min(8, { error: 'Confirm Password must be at least 8 characters' })
            .max(64, { error: 'Confirm Password must be at most 64 characters' }),
        language: z
            .string()
            .trim()
            .length(2, { error: 'Language must be a 2-character code' })
            .default('en'),
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export const invitationFilterSchema = z
    .object({
        organizationUuid: z.uuid({ error: 'Invalid organization UUID' }).optional(),
        role: z
            .enum([Role.OWNER, Role.MANAGER, Role.CRM, Role.WORKER], {
                error: 'Invalid invitation role',
            })
            .optional(),
        status: z.enum(InvitationStatus, { error: 'Invalid invitation status' }).optional(),
    })
    .strict();

export const queryInvitationSchema = querySchema
    .extend({
        search: z
            .string()
            .trim()
            .max(320, { error: 'Search must be at most 320 characters' })
            .optional(),
        filter: invitationFilterSchema.optional(),
        sortBy: z
            .enum([SORT_BY_CREATED_AT_UTC, SORT_BY_EXPIRES_AT_UTC, SORT_BY_UPDATED_AT_UTC], {
                error: 'Invalid sort field',
            })
            .optional(),
    })
    .strict();
