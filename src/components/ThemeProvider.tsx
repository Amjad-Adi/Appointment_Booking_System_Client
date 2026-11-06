import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { Theme } from '../models/enums/theme.ts';

type ThemeProviderProps = {
    children: ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    resolvedTheme: Theme.LIGHT | Theme.DARK;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: Theme.SYSTEM,
    resolvedTheme: Theme.LIGHT,
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

function resolveTheme(theme: Theme): Theme.LIGHT | Theme.DARK {
    if (theme === Theme.SYSTEM) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? Theme.DARK
            : Theme.LIGHT;
    }

    return theme === Theme.DARK ? Theme.DARK : Theme.LIGHT;
}

export function ThemeProvider({
    children,
    defaultTheme = Theme.SYSTEM,
    storageKey = 'appointment-theme',
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(() => {
        try {
            const storedTheme = localStorage.getItem(storageKey);

            return storedTheme === Theme.LIGHT ||
                storedTheme === Theme.DARK ||
                storedTheme === Theme.SYSTEM
                ? storedTheme
                : defaultTheme;
        } catch {
            return defaultTheme;
        }
    });

    useEffect(() => {
        const root = document.documentElement;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const applyTheme = () => {
            const resolvedTheme = resolveTheme(theme);
            const isDark = resolvedTheme === Theme.DARK;

            root.classList.remove('light', 'dark');
            root.classList.add(isDark ? 'dark' : 'light');
            root.style.colorScheme = isDark ? 'dark' : 'light';

            const browserTheme = document.querySelector('meta[name="theme-color"]');

            if (browserTheme) {
                browserTheme.setAttribute(
                    'content',
                    getComputedStyle(root).getPropertyValue('--background').trim(),
                );
            }
        };

        applyTheme();

        if (theme === Theme.SYSTEM) {
            mediaQuery.addEventListener('change', applyTheme);

            return () => mediaQuery.removeEventListener('change', applyTheme);
        }
    }, [theme]);

    const setTheme = useCallback(
        (nextTheme: Theme) => {
            try {
                localStorage.setItem(storageKey, nextTheme);
            } catch {
                // The theme still applies for this session.
            }

            setThemeState(nextTheme);
        },
        [storageKey],
    );

    return (
        <ThemeProviderContext.Provider
            value={{ theme, resolvedTheme: resolveTheme(theme), setTheme }}
        >
            {children}
        </ThemeProviderContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeProviderContext);
}
