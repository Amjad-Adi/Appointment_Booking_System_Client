import { z } from 'zod';
import { ActivationStatus } from '../models/enums/activation-status';
import { Role } from '../models/enums/roles';
import { querySchema } from './query.schema';
export const DEFAULT_LANGUAGE = 'en';
export const SORT_BY_NAME = 'name';
export const SORT_BY_CREATED_AT_UTC = 'createdAtUTC';
export const SORT_BY_UPDATED_AT_UTC = 'updatedAtUTC';

const userDetailsSchema = z
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
        email: z.email({ error: 'Invalid email address' }),
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
            .default(DEFAULT_LANGUAGE),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export const registerUserSchema = userDetailsSchema
    .extend({
        role: z.enum([Role.CUSTOMER, Role.OWNER], { error: 'Invalid user role' }),
        privacyPolicy: z.literal(true, { error: 'You must accept the Privacy Policy' }),
    })
    .strict();

export const createUserSchema = userDetailsSchema
    .extend({
        role: z.enum(Role, { error: 'Invalid user role' }),
    })
    .strict();

export const createUserByAdminSchema = createUserSchema;

export const updateUserSchema = z
    .object({
        firstName: z
            .string()
            .trim()
            .nonempty({ error: 'First Name is required' })
            .max(64, { error: 'First Name must be at most 64 characters' })
            .optional(),
        lastName: z
            .string()
            .trim()
            .nonempty({ error: 'Last Name is required' })
            .max(64, { error: 'Last Name must be at most 64 characters' })
            .optional(),
        language: z
            .string()
            .trim()
            .length(2, { error: 'Language must be a 2-character code' })
            .optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length !== 0, {
        message: 'At least one field must be provided',
    });

export const updateUserPasswordSchema = z
    .object({
        password: z
            .string()
            .trim()
            .min(8, { error: 'Password must be at least 8 characters' })
            .max(64, { error: 'Password must be at most 64 characters' }),
        confirmPassword: z
            .string()
            .trim()
            .min(8, { error: 'Confirm Password must be at least 8 characters' })
            .max(64, { error: 'Confirm Password must be at most 64 characters' }),
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export const loginFormSchema = z
    .object({
        email: z.email({ error: 'Invalid email address' }),
        password: z.string().trim().nonempty({ error: 'Password is required' }),
    })
    .strict();

export const updateUserByAdminSchema = z
    .object({
        role: z.enum(Role, { error: 'Invalid user role' }).optional(),
        status: z.enum(ActivationStatus, { error: 'Invalid activation status' }).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length !== 0, {
        message: 'At least one field must be provided',
    });

export const userFilterSchema = z
    .object({
        organizationUuid: z.uuid({ error: 'Invalid organization UUID' }).optional(),
        role: z.enum(Role, { error: 'Invalid user role filter' }).optional(),
        status: z.enum(ActivationStatus, { error: 'Invalid activation status filter' }).optional(),
    })
    .strict();

export const queryOrganizationCustomerSchema = querySchema
    .extend({
        search: z
            .string()
            .trim()
            .max(320, { error: 'Search must be at most 320 characters' })
            .optional(),
        sortBy: z.enum([SORT_BY_NAME, SORT_BY_CREATED_AT_UTC], {
            error: 'Invalid sort field',
        }).optional(),
    })
    .strict();

export const queryUserSchema = querySchema
    .extend({
        search: z
            .string()
            .trim()
            .nonempty({ error: 'Search cannot be empty' })
            .max(320, { error: 'Search must be at most 320 characters' })
            .optional(),
        filter: userFilterSchema.optional(),
        sortBy: z
            .enum([SORT_BY_NAME, SORT_BY_CREATED_AT_UTC, SORT_BY_UPDATED_AT_UTC], {
                error: 'Invalid sort field',
            })
            .optional(),
    })
    .strict();
