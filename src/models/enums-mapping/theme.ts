import { Theme } from '../enums/theme.ts';

export const themeRecord: Record<Theme, string> = {
    [Theme.LIGHT]: 'Light',
    [Theme.DARK]: 'Dark',
    [Theme.SYSTEM]: 'System',
};
