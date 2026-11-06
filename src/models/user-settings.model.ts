import { z } from 'zod';

import { Theme } from './enums/theme';
import { userSettingsFormSchema } from '../zod-schemas/settings.schema';

export interface UserSettings {
    language: string;
    theme: Theme;
    emailNotifications: boolean;
    appointmentReminders: boolean;
    marketingEmails: boolean;
    createdAtUTC: string;
    updatedAtUTC: string;
}

export type UserSettingsForm = z.infer<typeof userSettingsFormSchema>;
