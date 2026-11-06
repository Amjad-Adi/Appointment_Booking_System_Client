import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import toast from 'react-hot-toast';
import { AlertCircle, Building2, Calendar, CheckCircle2, Mail, ShieldCheck } from 'lucide-react';

import { Button } from '../../../../components/Button.tsx';
import { Select } from '../../../../components/Select.tsx';
import { TextField } from '../../../../components/TextField.tsx';
import { ThemeToggle } from '../../../../components/ThemeToggle.tsx';

import { useAcceptInvitation, usePublicInvitation } from '../../hooks/invitation-hook.ts';

import { acceptInvitationSchema } from '../../../../zod-schemas/invitations.schema.ts';
import { InvitationStatus } from '../../../../models/enums/invitation-status.ts';
import { Language } from '../../../../models/enums/language.ts';
import { languageRecord } from '../../../../models/enums-mapping/language.ts';
import { roleRecord } from '../../../../models/enums-mapping/roles.ts';
import { getApiErrorMessage } from '../../../../utlis/api-error.ts';

type AcceptInvitationFormInput = z.input<typeof acceptInvitationSchema>;
type AcceptInvitationFormOutput = z.output<typeof acceptInvitationSchema>;

export function AcceptInvitationPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const navigate = useNavigate();
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [accepted, setAccepted] = useState(false);

    const { data: invitation, isLoading, isError, error } = usePublicInvitation(token);
    const acceptMutation = useAcceptInvitation();

    const form = useForm<AcceptInvitationFormInput, any, AcceptInvitationFormOutput>({
        resolver: zodResolver(acceptInvitationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            language: Language.ENGLISH,
        },
    });

    if (!token) {
        return (
            <InvitationMessage
                icon={<AlertCircle className="size-6 text-destructive" />}
                title="Invalid link"
                message="No invitation token was provided in the URL."
                onAction={() => navigate('/login')}
                actionLabel="Go to login"
            />
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p className="text-[11px] text-muted-foreground">Verifying invitation link...</p>
            </div>
        );
    }

    if (isError || !invitation || invitation.status !== InvitationStatus.PENDING) {
        const errorMessage = getApiErrorMessage(
            error,
            'This invitation is invalid, already used, or has expired.',
        );

        return (
            <InvitationMessage
                icon={<AlertCircle className="size-6 text-destructive" />}
                title="Invitation unavailable"
                message={errorMessage}
                onAction={() => navigate('/login')}
                actionLabel="Go to login"
            />
        );
    }

    if (accepted) {
        return (
            <InvitationMessage
                icon={<CheckCircle2 className="size-6 text-success" />}
                title="Account created"
                message={`Your ${roleRecord[invitation.role] ?? invitation.role} account for ${
                    invitation.organizationName
                } is ready. Sign in with ${invitation.recipientEmail} to continue.`}
                onAction={() => navigate('/login')}
                actionLabel="Sign in"
            />
        );
    }

    const handlePictureChange = (file: File | null) => {
        if (!file) {
            setProfilePicture(null);
            return;
        }

        const allowedTypes = new Set(['image/jpeg', 'image/png']);

        if (!allowedTypes.has(file.type)) {
            toast.error('Only JPG and PNG images are allowed.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Profile picture must be smaller than 2MB.');
            return;
        }

        setProfilePicture(file);
    };

    const handleSubmit = form.handleSubmit(async (values) => {
        try {
            await toast.promise(
                acceptMutation.mutateAsync({
                    token,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                    language: values.language,
                    profilePicture,
                }),
                {
                    loading: 'Creating your account...',
                    success: 'Your account is ready!',
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to accept the invitation.'),
                },
            );

            setAccepted(true);
        } catch {
            // The error is surfaced by toast.promise.
        }
    });

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
            <div className="absolute top-4 right-4 z-10">
                <ThemeToggle syncToServer={false} />
            </div>

            <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-xl sm:p-7">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-secondary">
                        <Building2 className="size-6 text-foreground" />
                    </div>

                    <h1 className="text-xl font-bold tracking-tight text-foreground">
                        Join {invitation.organizationName || 'Organization'}
                    </h1>

                    <p className="mt-1 text-[13px] text-muted-foreground">
                        Create your account to start collaborating.
                    </p>
                </div>

                <div className="mb-6 rounded-lg border border-border bg-card p-4">
                    <ul className="flex flex-col gap-3 text-[12px] text-foreground">
                        <li className="flex items-center gap-3">
                            <Mail className="size-4 shrink-0 text-muted-foreground" />
                            <span className="truncate font-medium">
                                {invitation.recipientEmail}
                            </span>
                        </li>

                        <li className="flex items-center gap-3">
                            <ShieldCheck className="size-4 shrink-0 text-muted-foreground" />
                            <span>
                                Role:{' '}
                                <strong className="font-medium">
                                    {roleRecord[invitation.role] ?? invitation.role}
                                </strong>
                            </span>
                        </li>

                        <li className="flex items-center gap-3">
                            <Calendar className="size-4 shrink-0 text-muted-foreground" />
                            <span>
                                Expires:{' '}
                                {new Date(invitation.expiresAtUTC).toLocaleDateString()}
                            </span>
                        </li>
                    </ul>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <TextField
                            label="First name"
                            id="invitation_first_name"
                            autoComplete="given-name"
                            errorMessage={form.formState.errors.firstName?.message}
                            {...form.register('firstName')}
                        />

                        <TextField
                            label="Last name"
                            id="invitation_last_name"
                            autoComplete="family-name"
                            errorMessage={form.formState.errors.lastName?.message}
                            {...form.register('lastName')}
                        />

                        <TextField
                            label="Password"
                            id="invitation_password"
                            type="password"
                            autoComplete="new-password"
                            errorMessage={form.formState.errors.password?.message}
                            {...form.register('password')}
                        />

                        <TextField
                            label="Confirm password"
                            id="invitation_confirm_password"
                            type="password"
                            autoComplete="new-password"
                            errorMessage={form.formState.errors.confirmPassword?.message}
                            {...form.register('confirmPassword')}
                        />

                        <Select
                            label="Language"
                            id="invitation_language"
                            hasError={Boolean(form.formState.errors.language)}
                            errorMessage={form.formState.errors.language?.message}
                            value={form.watch('language') ?? ''}
                            {...form.register('language')}
                        >
                            {Object.values(Language).map((language) => (
                                <option key={language} value={language}>
                                    {languageRecord[language]}
                                </option>
                            ))}
                        </Select>

                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="invitation_picture"
                                className="text-[11px] font-medium text-foreground"
                            >
                                Profile picture
                                <span className="ml-1 font-normal text-muted-foreground">
                                    (Optional)
                                </span>
                            </label>

                            <input
                                id="invitation_picture"
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={(event) =>
                                    handlePictureChange(event.target.files?.[0] ?? null)
                                }
                                className="h-8 w-full min-w-0 rounded-lg border border-border bg-card px-2 text-[10px] text-secondary-foreground file:mr-2 file:h-6 file:rounded-md file:border-0 file:bg-secondary file:px-2 file:text-[10px] file:font-semibold file:text-foreground"
                            />

                            <p className="text-[9px] text-muted-foreground">JPG or PNG, up to 2MB.</p>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={acceptMutation.isPending}
                        className="mt-2 h-10 w-full text-[13px] font-semibold"
                    >
                        {acceptMutation.isPending ? 'Creating account...' : 'Accept Invitation'}
                    </Button>
                </form>

                <p className="mt-4 text-center text-[10px] leading-4 text-muted-foreground">
                    Already have an account? Contact the organization that invited you.
                </p>
            </div>
        </div>
    );
}

function InvitationMessage({
    icon,
    title,
    message,
    onAction,
    actionLabel,
}: {
    icon: React.ReactNode;
    title: string;
    message: string;
    onAction: () => void;
    actionLabel: string;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center shadow-xl">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-secondary">
                    {icon}
                </div>

                <h1 className="mb-2 text-lg font-semibold text-foreground">{title}</h1>

                <p className="text-[13px] leading-5 text-muted-foreground">{message}</p>

                <Button
                    type="button"
                    onClick={onAction}
                    className="mt-6 h-10 w-full text-[13px] font-semibold"
                >
                    {actionLabel}
                </Button>
            </div>
        </div>
    );
}
