import { Moon, Sun } from 'lucide-react';

import { useTheme } from './ThemeProvider.tsx';

import { useUpdateUserSettings } from '../features/management/hooks/settings-hook.ts';

import { Theme } from '../models/enums/theme.ts';

export function ThemeToggle({ syncToServer = true }: { syncToServer?: boolean }) {
    const { resolvedTheme, setTheme } = useTheme();
    const updateSettingsMutation = useUpdateUserSettings();
    const isDark = resolvedTheme === Theme.DARK;

    const toggleTheme = () => {
        const nextTheme = isDark ? Theme.LIGHT : Theme.DARK;

        setTheme(nextTheme);

        if (syncToServer) {
            updateSettingsMutation.mutate(
                { theme: nextTheme },
                {
                    onError: () => {
                        // The theme still applies locally for this session.
                    },
                },
            );
        }
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
            <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />

            <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />

            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
