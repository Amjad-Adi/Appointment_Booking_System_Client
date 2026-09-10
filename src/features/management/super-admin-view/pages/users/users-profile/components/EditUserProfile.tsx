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

import { Toast } from '../../../../../../../utlis/toast.ts';

import { updateUserByAdminSchema } from '../../../../../../../zod-schemas/user.schema.ts';

import { Role } from '../../../../../../../models/enums/roles.ts';
import { ActivationStatus } from '../../../../../../../models/enums/activation-status.ts';

import { useUpdateUser } from '../../../../../hooks/users-hook.ts';

import { UserProfileHeader } from '../../../../../components/UserProfileHeader.tsx';
import { UserAboutCard } from './UserAboutCard.tsx';
import { UserOrganizationCard } from './UserOrganizationCard.tsx';

interface EditUserProfileProps {
    user: UserResponse;
}

const loading = 'Updating user...';
const success = 'User updated successfully';
const error = 'Failed to update user';

export function EditUserProfile({ user }: EditUserProfileProps) {
    const navigate = useNavigate();
    const updateUserMutation = useUpdateUser();

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

        if (Object.keys(changedValues).length === 0) {
            navigate(`/admin/users/${user.uuid}`);
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
                    className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 border border-[#d3d3df] bg-transparent px-3 text-[11px] font-semibold text-[#454556] hover:bg-[#ededf2] hover:text-[#343447]"
                >
                    <ArrowLeft className="size-3.5 transition-colors group-hover:text-[#343447]" />
                    Close
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 px-3 text-[11px] font-semibold"
                >
                    <Check className="group-hover size-3.5 transition-colors" />
                    Save
                </Button>
            </div>

            <UserProfileHeader user={user} />

            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                <UserAboutCard user={user} />

                <UserOrganizationCard organizationUuid={user.organizationUuid} />
            </div>

            <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
                <div className="min-w-0">
                    <h3 className="text-[13px] font-semibold text-[#343447]">
                        Account Information
                    </h3>

                    <p className="mt-0.5 text-[10px] leading-4 text-[#777789]">
                        Administrative information associated with this account.
                    </p>
                </div>

                <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#ededf2] text-[#777789]">
                            <UserRound className="size-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-medium tracking-wide text-[#9999aa] uppercase">
                                Role
                            </p>

                            <Select
                                id="role"
                                hasError={false}
                                {...register('role')}
                                className="mt-1 h-8 w-full px-2.5 text-[11px]"
                            >
                                {Object.values(Role).map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#ededf2] text-[#777789]">
                            <ShieldCheck className="size-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-medium tracking-wide text-[#9999aa] uppercase">
                                Status
                            </p>

                            <Select
                                id="status"
                                hasError={false}
                                {...register('status')}
                                className="mt-1 h-8 w-full px-2.5 text-[11px]"
                            >
                                {Object.values(ActivationStatus).map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#ededf2] text-[#777789]">
                            <CalendarDays className="size-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-medium tracking-wide text-[#9999aa] uppercase">
                                Last Updated
                            </p>

                            <p
                                className="mt-0.5 truncate text-[11px] font-medium text-[#454556]"
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
