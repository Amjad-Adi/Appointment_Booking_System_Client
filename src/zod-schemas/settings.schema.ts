import { z } from 'zod';

import { Theme } from '../models/enums/theme';

export const userSettingsFormSchema = z
    .object({
        language: z
            .string()
            .trim()
            .min(2, { error: 'Language must be at least 2 characters' })
            .max(8, { error: 'Language must be at most 8 characters' }),
        theme: z.enum(Theme, { error: 'Invalid theme' }),
        emailNotifications: z.boolean(),
        appointmentReminders: z.boolean(),
        marketingEmails: z.boolean(),
    })
    .strict();
