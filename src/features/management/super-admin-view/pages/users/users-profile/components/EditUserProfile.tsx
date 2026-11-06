import { useState } from 'react';
import { ArrowLeft, CalendarDays, Check, ShieldCheck, UserRound } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

import type {
    UpdateUserByAdminForm,
    UserResponse,
} from '../../../../../../../models/user.model.ts';

import { Button } from '../../../../../../../components/Button.tsx';
import { Select } from '../../../../../../../components/Select.tsx';
import { ImagePicker } from '../../../../../../../components/ImagePicker.tsx';

import { getApiErrorMessage } from '../../../../../../../utlis/api-error.ts';

import { updateUserByAdminSchema } from '../../../../../../../zod-schemas/user.schema.ts';

import { Role } from '../../../../../../../models/enums/roles.ts';
import { ActivationStatus } from '../../../../../../../models/enums/activation-status.ts';

import { useUpdateUser } from '../../../../../hooks/users-hook.ts';

import { UserProfileHeader } from '../../../../../components/UserProfileHeader.tsx';
import { UserAboutCard } from './UserAboutCard.tsx';
import { UserOrganizationCard } from './UserOrganizationCard.tsx';
import { roleRecord } from '../../../../../../../models/enums-mapping/roles.ts';
import { activationStatusRecord } from '../../../../../../../models/enums-mapping/activation-status.ts';

interface EditUserProfileProps {
    user: UserResponse;
}

const loading = 'Updating user...';
const success = 'User updated successfully';
const error = 'Failed to update user';

export function EditUserProfile({ user }: EditUserProfileProps) {
    const navigate = useNavigate();
    const updateUserMutation = useUpdateUser();
    const [picture, setPicture] = useState<File | null>(null);

    const defaultValues: UpdateUserByAdminForm = {
        role: user.role,
        status: user.status,
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { isSubmitting, isDirty },
    } = useForm<UpdateUserByAdminForm>({
        resolver: zodResolver(updateUserByAdminSchema),
        defaultValues,
    });

    const role = watch('role');
    const status = watch('status');

    const handleSubmitForm = async () => {
        const changedValues: Partial<UpdateUserByAdminForm> = {};

        if (role !== defaultValues.role) {
            changedValues.role = role;
        }

        if (status !== defaultValues.status) {
            changedValues.status = status;
        }

        if (Object.keys(changedValues).length === 0 && picture === null) {
            navigate(`/admin/users/${user.uuid}`);
            return;
        }

        try {
            await toast.promise(
                updateUserMutation.mutateAsync({
                    uuid: user.uuid,
                    ...changedValues,
                    profilePicture: picture,
                }),
                {
                    loading,
                    success,
                    error: (mutationError) => getApiErrorMessage(mutationError, error),
                },
            );

            setPicture(null);
            navigate(`/admin/users/${user.uuid}`);
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
                    onClick={() => navigate(`/admin/users/${user.uuid}`)}
                    disabled={isSubmitting}
                    className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 border border-border bg-transparent px-3 text-[11px] font-semibold text-secondary-foreground hover:bg-secondary hover:text-foreground"
                >
                    <ArrowLeft className="size-3.5 transition-colors group-hover:text-foreground" />
                    Close
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting || (!isDirty && picture === null)}
                    className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 px-3 text-[11px] font-semibold"
                >
                    <Check className="group-hover size-3.5 transition-colors" />
                    Save
                </Button>
            </div>

            <UserProfileHeader user={user} />

            <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
                <div className="min-w-0">
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
                <UserAboutCard user={user} />

                <UserOrganizationCard organizationUuid={user.organizationUuid} />
            </div>

            <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
                <div className="min-w-0">
                    <h3 className="text-[13px] font-semibold text-foreground">
                        Account Information
                    </h3>

                    <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                        Administrative information associated with this account.
                    </p>
                </div>

                <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground">
                            <UserRound className="size-4" />
                        </div>
                        <Select
                            id="role"
                            hasError={false}
                            value={role ?? ''}
                            {...register('role')}
                            className="mt-1 h-8 w-full px-2.5 text-[11px]"
                            label={'Role'}
                        >
                            {Object.values(Role).map((role) => (
                                <option key={role} value={role}>
                                    {roleRecord[role]}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground">
                            <ShieldCheck className="size-4" />
                        </div>
                        <Select
                            id="status"
                            hasError={false}
                            value={status ?? ''}
                            {...register('status')}
                            className="mt-1 h-8 w-full px-2.5 text-[11px]"
                            label={'Status'}
                        >
                            {Object.values(ActivationStatus).map((status) => (
                                <option key={status} value={status}>
                                    {activationStatusRecord[status]}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground">
                            <CalendarDays className="size-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-medium tracking-wide text-muted-foreground uppercase">
                                Last Updated
                            </p>

                            <p
                                className="mt-0.5 truncate text-[11px] font-medium text-secondary-foreground"
                                title={formatDate(user.updatedAtUTC)}
                            >
                                {formatDate(user.updatedAtUTC)}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </form>
    );
}

function formatDate(value: Date | string) {
    return new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
