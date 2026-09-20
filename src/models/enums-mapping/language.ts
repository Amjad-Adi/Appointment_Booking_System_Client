import { Language } from '../enums/language.ts';
import { activationStatusRecord } from './activation-status.ts';

export const languageRecord: Record<Language, string> = {
    [Language.ENGLISH]: 'English',
    [Language.ARABIC]: 'العربية',
    [Language.FRANCIS]: 'Français',
    [Language.DEUTSCH]: 'Deutsch',
};