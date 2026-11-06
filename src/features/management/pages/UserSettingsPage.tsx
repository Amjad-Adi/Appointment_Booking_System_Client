import { useState } from 'react';
import { BellRing, Check, LanguagesIcon, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

import { ManagementPage } from '../components/ManagementPage.tsx';
import { Button } from '../../../components/Button.tsx';
import { Select } from '../../../components/Select.tsx';
import { LoadingState } from '../../../components/LoadingState.tsx';
import { ErrorState } from '../../../components/ErrorState.tsx';

import { getApiErrorMessage } from '../../../utlis/api-error.ts';

import { useUpdateUserSettings, useUserSettings } from '../hooks/settings-hook.ts';
import { useTheme } from '../../../components/ThemeProvider.tsx';

import { Language } from '../../../models/enums/language.ts';
import { Theme } from '../../../models/enums/theme.ts';
import { languageRecord } from '../../../models/enums-mapping/language.ts';
import { themeRecord } from '../../../models/enums-mapping/theme.ts';
import type { UserSettingsForm } from '../../../models/user-settings.model.ts';

interface UserSettingsPageProps {
    title?: string;
    description?: string[];
}

const notificationOptions: {
    key: keyof Pick<
        UserSettingsForm,
        'emailNotifications' | 'appointmentReminders' | 'marketingEmails'
    >;
    label: string;
    description: string;
    comingSoon: boolean;
}[] = [
    {
        key: 'emailNotifications',
        label: 'Email notifications',
        description: 'Receive account and appointment activity by email.',
        comingSoon: true,
    },
    {
        key: 'appointmentReminders',
        label: 'Appointment reminders',
        description: 'Get a reminder before your upcoming appointments.',
        comingSoon: true,
    },
    {
        key: 'marketingEmails',
        label: 'Marketing emails',
        description: 'Receive product news, offers and promotions.',
        comingSoon: true,
    },
];

export function UserSettingsPage({
    title = 'Settings',
    description = ['Manage your language, appearance and notification preferences.'],
}: UserSettingsPageProps) {
    const { data, isLoading, isError, error, refetch } = useUserSettings();
    const updateMutation = useUpdateUserSettings();
    const { setTheme } = useTheme();

    /*
     * Edits are kept in a draft; until the user changes something the form
     * mirrors the loaded settings, including after a refetch.
     */
    const [draft, setDraft] = useState<UserSettingsForm | undefined>();

    const form: UserSettingsForm | undefined =
        draft ??
        (data
            ? {
                  language: data.language || Language.ENGLISH,
                  theme: data.theme ?? Theme.SYSTEM,
                  emailNotifications: data.emailNotifications,
                  appointmentReminders: data.appointmentReminders,
                  marketingEmails: data.marketingEmails,
              }
            : undefined);

    const handleSave = async () => {
        if (!form) {
            return;
        }

        try {
            await toast.promise(updateMutation.mutateAsync(form), {
                loading: 'Saving settings...',
                success: 'Settings saved',
                error: (mutationError) =>
                    getApiErrorMessage(mutationError, 'Failed to save settings'),
            });
        } catch {
            // Error is surfaced by toast.promise.
        }
    };

    if (isLoading) {
        return (
            <ManagementPage title={title} description={description}>
                <LoadingState label="Loading settings..." rows={3} />
            </ManagementPage>
        );
    }

    if (isError || !form) {
        return (
            <ManagementPage title={title} description={description}>
                <ErrorState
                    error={error}
                    title="Failed to load settings"
                    onRetry={() => {
                        void refetch();
                    }}
                />
            </ManagementPage>
        );
    }

    return (
        <ManagementPage title={title} description={description}>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                    <section className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                                <LanguagesIcon className="size-4" />
                            </div>

                            <div>
                                <h3 className="text-[13px] font-semibold text-foreground">
                                    Language &amp; region
                                </h3>

                                <p className="text-[10px] text-muted-foreground">
                                    Choose the language used across your account.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Select
                                id="settings-language"
                                label="Language"
                                value={form.language}
                                onChange={(event) =>
                                    setDraft({ ...form, language: event.target.value as Language })
                                }
                                className="h-8 px-2.5 text-[11px]"
                            >
                                {Object.values(Language).map((language) => (
                                    <option key={language} value={language}>
                                        {languageRecord[language]}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </section>

                    <section className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                                <Palette className="size-4" />
                            </div>

                            <div>
                                <h3 className="text-[13px] font-semibold text-foreground">
                                    Appearance
                                </h3>

                                <p className="text-[10px] text-muted-foreground">
                                    Pick the theme that suits your environment.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Select
                                id="settings-theme"
                                label="Theme"
                                value={form.theme}
                                onChange={(event) => {
                                    const theme = event.target.value as Theme;

                                    setDraft({
                                        ...form,
                                        theme,
                                    });
                                    setTheme(theme);
                                }}
                                className="h-8 px-2.5 text-[11px]"
                            >
                                {Object.values(Theme).map((theme) => (
                                    <option key={theme} value={theme}>
                                        {themeRecord[theme]}
                                    </option>
                                ))}
                            </Select>

                            <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
                                Theme changes preview instantly. Save settings to keep them on
                                your account.
                            </p>
                        </div>
                    </section>
                </div>

                <section className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                            <BellRing className="size-4" />
                        </div>

                        <div>
                            <h3 className="text-[13px] font-semibold text-foreground">
                                Notifications
                            </h3>

                            <p className="text-[10px] text-muted-foreground">
                                Notification preferences will be available in a future update.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                        {notificationOptions.map((option) => (
                            <label
                                key={option.key}
                                className={`flex items-start gap-3 rounded-lg border border-border bg-card px-3 py-2.5 ${
                                    option.comingSoon ? 'cursor-not-allowed' : 'cursor-pointer'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={form[option.key]}
                                    disabled={option.comingSoon}
                                    onChange={(event) =>
                                        setDraft({
                                            ...form,
                                            [option.key]: event.target.checked,
                                        })
                                    }
                                    className="mt-0.5 size-3.5 shrink-0 accent-primary disabled:opacity-50"
                                />

                                <span className="min-w-0">
                                    <span className="flex flex-wrap items-center gap-2">
                                        <span className="text-[11px] font-medium text-foreground">
                                            {option.label}
                                        </span>

                                        {option.comingSoon ? (
                                            <span className="rounded-full border border-warning-border bg-warning-soft px-1.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase text-warning">
                                                Coming soon
                                            </span>
                                        ) : null}
                                    </span>

                                    <span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">
                                        {option.description}
                                    </span>
                                </span>
                            </label>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end">
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                        className="group flex h-8 items-center gap-1.5 px-3 text-[11px] font-semibold"
                    >
                        <Check className="size-3.5" />
                        Save Settings
                    </Button>
                </div>
            </div>
        </ManagementPage>
    );
}
