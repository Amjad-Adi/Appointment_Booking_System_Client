import { ArrowLeft, Check, LockKeyhole, UserRound } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

import type { UserResponse } from '../../..//../../../models/user.model.ts';

import { Button } from '../../../../../../components/Button.tsx';
import { TextField } from '../../../../../../components/TextField.tsx';
import { Select } from '../../../../../../components/Select.tsx';

import { Toast } from '../../../../../../utlis/toast.ts';

import { updateUserSchema } from '../../../../../../zod-schemas/user.schema.ts';

import { useUpdateUser } from '../../../../hooks/users-hook.ts';

import { UserProfileHeader } from '../../../../components/UserProfileHeader.tsx';

type EditProfileForm = {
    firstName?: string;
    lastName?: string;
    password?: string;
    confirmPassword?: string;
    profilePicturePath?: string;
    language?: string;
};

interface EditProfileProps {
    user: UserResponse;
}

const loading = 'Updating profile...';
const success = 'Profile updated successfully';
const error = 'Failed to update profile';

export function EditProfile({ user }: EditProfileProps) {
    const navigate = useNavigate();
    const updateUserMutation = useUpdateUser();

    const defaultValues: EditProfileForm = {
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicturePath: user.profilePicturePath,
        language: user.language,
        password: '',
        confirmPassword: '',
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<EditProfileForm>({
        resolver: zodResolver(updateUserSchema),
        defaultValues,
    });

    const firstName = watch('firstName');
    const lastName = watch('lastName');
    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    const profilePicturePath = watch('profilePicturePath');
    const language = watch('language');

    const handleSubmitForm = async () => {
        const changedValues: Partial<EditProfileForm> = {};

        if (firstName !== defaultValues.firstName) {
            changedValues.firstName = firstName;
        }

        if (lastName !== defaultValues.lastName) {
            changedValues.lastName = lastName;
        }

        if (profilePicturePath !== defaultValues.profilePicturePath) {
            changedValues.profilePicturePath = profilePicturePath;
        }

        if (language !== defaultValues.language) {
            changedValues.language = language;
        }

        if (password) {
            changedValues.password = password;
            changedValues.confirmPassword = confirmPassword;
        }

        if (Object.keys(changedValues).length === 0) {
            navigate('/admin/profile');
            return;
        }

        try {
            await toast.promise(
                updateUserMutation.mutateAsync({
                    uuid: user.uuid,
                    ...changedValues,
                }),
                new Toast(loading, success, error),
            );

            navigate('/admin/profile');
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
                    onClick={() => navigate('/profile')}
                    disabled={isSubmitting}
                    className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 border border-[#d3d3df] bg-transparent px-3 text-[11px] font-semibold text-[#454556] hover:bg-[#ededf2] hover:text-[#343447]"
                >
                    <ArrowLeft className="group-hover size-3.5 transition-colors" />
                    Close
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 px-3 text-[11px] font-semibold"
                >
                    <Check className="group-hover size-3.5" />
                    Save
                </Button>
            </div>

            <UserProfileHeader user={user} />

            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
                    <div>
                        <h3 className="text-[13px] font-semibold text-[#343447]">
                            Personal Information
                        </h3>

                        <p className="mt-0.5 text-[10px] leading-4 text-[#777789]">
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

                <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
                    <div>
                        <h3 className="text-[13px] font-semibold text-[#343447]">
                            Account Information
                        </h3>

                        <p className="mt-0.5 text-[10px] leading-4 text-[#777789]">
                            Update your account preferences.
                        </p>
                    </div>

                    <div className="mt-5 flex flex-col gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#ededf2] text-[#777789]">
                                <UserRound className="size-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-[9px] font-medium tracking-wide text-[#9999aa] uppercase">
                                    Language
                                </p>

                                <Select
                                    id="language"
                                    hasError={!!errors.language}
                                    {...register('language')}
                                    className="mt-1 h-8 w-full px-2.5 text-[11px]"
                                >
                                    <option value="en">English</option>
                                    <option value="ar">Arabic</option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
                <div>
                    <h3 className="text-[13px] font-semibold text-[#343447]">Password</h3>

                    <p className="mt-0.5 text-[10px] leading-4 text-[#777789]">
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
                        {...register('password')}
                    />

                    <TextField
                        id="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        hasError={!!errors.confirmPassword}
                        errorMessage={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />
                </div>
            </section>
        </form>
    );
}
