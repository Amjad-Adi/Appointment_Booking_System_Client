import { z } from 'zod';
import { ActivationStatus } from '../models/enums/activation-status.js';
import { Role } from '../models/enums/roles.js';
import { querySchema } from './query.schema.js';
export const DEFAULT_LANGUAGE = 'en';
export const SORT_BY_NAME = 'name';
export const SORT_BY_CREATED_AT_UTC = 'createdAtUTC';

export const createUserSchema = z

    .object({
        firstName: z
            .string()
            .trim()
            .nonempty({ error: 'First Name is required' })
            .max(64, { error: 'Password must be at most 64 characters' }),
        lastName: z
            .string()
            .trim()
            .nonempty({ error: 'Last Name is required' })
            .max(64, { error: 'Password must be at most 64 characters' }),
        email: z.email({ error: 'Email is required' }),
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
            .min(8, { error: 'Password must be at least 8 characters' })
            .max(64, { error: 'Password must be at most 64 characters' }),
        profilePicturePath: z.string().trim().nonempty().optional(),
        language: z.string().trim().length(2),
        role: z.enum([Role.CUSTOMER, Role.OWNER]),
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword);

export const registerUserSchema = createUserSchema
    .extend({
        privacyPolicy: z.literal(true, {
            error: 'You must accept the Privacy Policy',
        }),
    })
    .strict();

export const inviteUserSchema = z
    .object({
        email: z.email(),
        role: z.enum(Role).refine((role) => role != Role.SUPER_ADMIN && role != Role.CUSTOMER),
    })
    .strict();

export const updateUserSchema = z
    .object({
        firstName: z.string().trim().nonempty().max(64).optional(),
        lastName: z.string().trim().nonempty().max(64).optional(),
        password: z
            .string()
            .trim()
            .nonempty({ error: 'Password is required' })
            .min(8, 'Password must be at least 8 characters')
            .max(64, 'Password must be at most 64 characters'),
        confirmPassword: z
            .string()
            .trim()
            .nonempty({ error: 'Confirm Password is required' })
            .min(8, { error: 'Password must be at least 8 characters' })
            .max(64, { error: 'Password must be at most 64 characters' }),
        profilePicturePath: z.string().trim().nonempty().optional(),
        language: z.string().trim().length(2).default(DEFAULT_LANGUAGE),
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword);

export const loginUserSchema = z
    .object({
        email: z.email('Invalid email'),
        password: z
            .string()
            .trim()
            .nonempty({ error: 'Password is required' })
            .min(8, { error: 'Password must be at least 8 characters' })
            .max(64, { error: 'Password must be at most 64 characters' }),
    })
    .strict();

export const updateUserByAdminSchema = z
    .object({
        role: z.enum(Role).optional(),
        status: z.enum(ActivationStatus).optional(),
    })
    .strict();

export const userFilterSchema = z
    .object({
        role: z.enum(Role).optional(),
        status: z.enum(ActivationStatus).optional(),
    })
    .strict();

export const queryUserSchema = querySchema
    .extend({
        search: z.string().trim().nonempty().max(320).optional(),
        filter: userFilterSchema.optional(),
        sortBy: z.enum([SORT_BY_NAME, SORT_BY_CREATED_AT_UTC]).optional(),
    })
    .strict();
