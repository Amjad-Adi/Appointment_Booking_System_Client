import { useState } from 'react';
import { ArrowLeft, Check, LanguagesIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { z } from 'zod';

import type { UserResponse } from '../../..//../../../models/user.model.ts';

import { Button } from '../../../../../../components/Button.tsx';
import { TextField } from '../../../../../../components/TextField.tsx';
import { Select } from '../../../../../../components/Select.tsx';
import { ImagePicker } from '../../../../../../components/ImagePicker.tsx';

import { useUpdateCurrentUser, useUpdateCurrentUserPassword } from '../../../../hooks/users-hook.ts';

import { getApiErrorMessage } from '../../../../../../utlis/api-error.ts';

import { UserProfileHeader } from '../../../../components/UserProfileHeader.tsx';
import { languageRecord } from '../../../../../../models/enums-mapping/language.ts';
import { Language } from '../../../../../../models/enums/language.ts';

type EditProfileForm = {
    firstName?: string;
    lastName?: string;
    password?: string;
    confirmPassword?: string;
    language?: string;
};

const editProfileFormSchema = z
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
        password: z
            .string()
            .trim()
            .min(8, { error: 'Password must be at least 8 characters' })
            .max(64, { error: 'Password must be at most 64 characters' })
            .optional()
            .or(z.literal('')),
        confirmPassword: z
            .string()
            .trim()
            .min(8, { error: 'Confirm Password must be at least 8 characters' })
            .max(64, { error: 'Confirm Password must be at most 64 characters' })
            .optional()
            .or(z.literal('')),
    })
    .refine((data) => !data.password || data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

interface EditProfileProps {
    user: UserResponse;
}

const loading = 'Updating profile...';
const success = 'Profile updated successfully';
const error = 'Failed to update profile';

export function EditProfile({ user }: EditProfileProps) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const updateCurrentUserMutation = useUpdateCurrentUser();
    const updatePasswordMutation = useUpdateCurrentUserPassword();
    const [picture, setPicture] = useState<File | null>(null);

    const basePath = pathname.replace(/\/edit$/, '');

    const defaultValues: EditProfileForm = {
        firstName: user.firstName,
        lastName: user.lastName,
        language: user.language,
        password: undefined,
        confirmPassword: undefined,
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<EditProfileForm>({
        resolver: zodResolver(editProfileFormSchema) as any,
        defaultValues,
    });

    const firstName = watch('firstName');
    const lastName = watch('lastName');
    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    const language = watch('language');

    const handleSubmitForm = async () => {
        const profileChanges: { firstName?: string; lastName?: string; language?: string } = {};

        if (firstName !== defaultValues.firstName && firstName !== undefined) {
            profileChanges.firstName = firstName;
        }

        if (lastName !== defaultValues.lastName && lastName !== undefined) {
            profileChanges.lastName = lastName;
        }

        if (language !== defaultValues.language && language !== undefined) {
            profileChanges.language = language;
        }

        const hasProfileChanges = Object.keys(profileChanges).length > 0;
        const hasPasswordChanges = Boolean(password);
        const hasPictureChanges = picture !== null;

        if (!hasProfileChanges && !hasPasswordChanges && !hasPictureChanges) {
            navigate(basePath);
            return;
        }

        try {
            await toast.promise(
                (async () => {
                    if (hasProfileChanges || hasPictureChanges) {
                        await updateCurrentUserMutation.mutateAsync({
                            ...profileChanges,
                            ...(picture ? { profilePicture: picture } : {}),
                        });
                    }

                    if (hasPasswordChanges) {
                        await updatePasswordMutation.mutateAsync({
                            password: password as string,
                            confirmPassword: confirmPassword as string,
                        });
                    }
                })(),
                {
                    loading,
                    success,
                    error: (mutationError) => getApiErrorMessage(mutationError, error),
                },
            );

            navigate(basePath);
        } catch {
            // Stay on the edit page if the update fails.
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="flex min-w-0 flex-1 flex-col gap-4"
        >
            <div className="flex min-w-0 items-center justify-between gap-3">
                <Button
                    type="button"
                    onClick={() => navigate(basePath)}
                    disabled={isSubmitting}
                    className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 border border-border bg-transparent px-3 text-[11px] font-semibold text-secondary-foreground hover:bg-secondary hover:text-foreground"
                >
                    <ArrowLeft className="group-hover size-3.5 transition-colors" />
                    Close
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting || (!isDirty && picture === null)}
                    className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 px-3 text-[11px] font-semibold"
                >
                    <Check className="group-hover size-3.5" />
                    Save
                </Button>
            </div>

            <UserProfileHeader user={user} />

            <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
                <div>
                    <h3 className="text-[13px] font-semibold text-foreground">Profile Picture</h3>

                    <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                        Upload a new picture to replace the current one.
                    </p>
                </div>

                <div className="mt-4">
                    <ImagePicker
                        file={picture}
                        onChange={setPicture}
                        currentPath={user.profilePicturePath}
                        label="Picture"
                        rounded="full"
                        disabled={isSubmitting}
                    />
                </div>
            </section>

            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
                    <div>
                        <h3 className="text-[13px] font-semibold text-foreground">
                            Personal Information
                        </h3>

                        <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                            Update your personal profile information.
                        </p>
                    </div>

                    <div className="mt-5 flex flex-col gap-4">
                        <TextField
                            id="firstName"
                            label="First Name"
                            hasError={!!errors.firstName}
                            errorMessage={errors.firstName?.message}
                            {...register('firstName')}
                        />

                        <TextField
                            id="lastName"
                            label="Last Name"
                            hasError={!!errors.lastName}
                            errorMessage={errors.lastName?.message}
                            {...register('lastName')}
                        />
                    </div>
                </section>

                <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
                    <div>
                        <h3 className="text-[13px] font-semibold text-foreground">
                            Account Information
                        </h3>

                        <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                            Update your account preferences.
                        </p>
                    </div>

                    <div className="mt-5 flex flex-col gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground">
                                <LanguagesIcon className="size-4" />
                            </div>

                            <Select
                                id="language"
                                hasError={!!errors.language}
                                value={language ?? ''}
                                {...register('language')}
                                className="mt-1 h-8 w-full px-2.5 text-[11px]"
                                label="Language"
                            >
                                <option value={Language.ENGLISH}>
                                    {languageRecord[Language.ENGLISH]}
                                </option>
                                <option value={Language.ARABIC}>
                                    {languageRecord[Language.ARABIC]}
                                </option>
                                <option value={Language.FRANCIS}>
                                    {languageRecord[Language.FRANCIS]}
                                </option>
                                <option value={Language.DEUTSCH}>
                                    {languageRecord[Language.DEUTSCH]}
                                </option>
                            </Select>
                        </div>
                    </div>
                </section>
            </div>

            <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
                <div>
                    <h3 className="text-[13px] font-semibold text-foreground">Password</h3>

                    <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                        Leave these fields empty if you do not want to change your password.
                    </p>
                </div>

                <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                    <TextField
                        id="password"
                        type="password"
                        label="New Password"
                        hasError={!!errors.password}
                        errorMessage={errors.password?.message}
                        {...register('password', {
                            setValueAs: (val) => (val === '' ? undefined : val),
                        })}
                    />

                    <TextField
                        id="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        hasError={!!errors.confirmPassword}
                        errorMessage={errors.confirmPassword?.message}
                        {...register('confirmPassword', {
                            setValueAs: (val) => (val === '' ? undefined : val),
                        })}
                    />
                </div>
            </section>
        </form>
    );
}
