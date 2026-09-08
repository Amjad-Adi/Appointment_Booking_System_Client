import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { TextField } from '../../../../../components/TextField.tsx';
import { Select } from '../../../../../components/Select.tsx';
import { Button } from '../../../../../components/Button.tsx';

import { useUpdateUser } from '../../../hooks/users-hook.ts';
import { updateUserByAdminSchema } from '../../../../../zod-schemas/user.schema.ts';

import { Role } from '../../../../../models/enums/roles.ts';
import { ActivationStatus } from '../../../../../models/enums/activation-status.ts';

import type { UserResponse, UpdateUserByAdminForm } from '../../../../../models/user.model.ts';
import toast from 'react-hot-toast';
import { Toast } from '../../../../../utlis/toast.ts';

interface EditUserDialogProps {
    user: UserResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const loading = 'Updating user...';
const success = 'User updated successfully';
const error = 'Failed to update user';

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
    const updateUserMutation = useUpdateUser();
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, dirtyFields },
    } = useForm<UpdateUserByAdminForm>({
        resolver: zodResolver(updateUserByAdminSchema),
        defaultValues: {
            role: user.role,
            status: user.status,
        },
    });
    watch('role');
    watch('status');
    useEffect(() => {
        reset({
            role: user.role,
            status: user.status,
        });
    }, [user.role, user.status, reset]);

    const onSubmit = async (data: UpdateUserByAdminForm) => {
        const changedData: Partial<UpdateUserByAdminForm> = {};
        if (dirtyFields.role) {
            changedData.role = data.role;
        }
        if (dirtyFields.status) {
            changedData.status = data.status;
        }
        if (Object.keys(changedData).length === 0) {
            onOpenChange(false);
            return;
        }
        await toast.promise(
            updateUserMutation.mutateAsync(
                {
                    uuid: user.uuid,
                    ...changedData,
                },
                {
                    onSuccess: () => {
                        onOpenChange(false);
                    },
                },
            ),
            new Toast(loading, success, error),
        );
    };

    const handleCancel = () => {
        reset({
            role: user.role,
            status: user.status,
        });
        onOpenChange(false);
    };

    if (!open) {
        return null;
    }
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
        >
            <div className="bg-background border-input-border w-full max-w-lg rounded-xl border p-5 shadow-2xl sm:p-6">
                <div className="mb-5">
                    <h2 id="edit-user-title" className="text-text-primary text-xl font-bold">
                        Edit User
                    </h2>
                    <p className="text-text-secondary mt-1 text-sm">
                        Update the user's role and activation status.
                    </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:gap-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                        <TextField
                            label="First Name"
                            id="firstName"
                            value={user.firstName}
                            disabled
                            isLabelDisabled={false}
                        />
                        <TextField
                            label="Last Name"
                            id="lastName"
                            value={user.lastName}
                            disabled
                            isLabelDisabled={false}
                        />
                    </div>
                    <TextField
                        label="Email"
                        id="email"
                        type="email"
                        value={user.email}
                        disabled
                        isLabelDisabled={false}
                    />
                    <div className="group flex flex-col gap-1">
                        <label htmlFor="role" className="text-text-primary text-sm font-semibold">
                            Role
                        </label>

                        <Select
                            id="role"
                            hasError={!!errors.role}
                            {...register('role')}
                            className="group-hover:border-input-hover transition-all duration-200"
                        >
                            <option value="">Select role</option>

                            {Object.values(Role).map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </Select>
                        <div className="min-h-[18px] w-full pt-1 sm:min-h-[20px]">
                            {errors.role?.message && (
                                <p className="text-error w-full ps-2 text-left text-[10px] leading-tight sm:text-[12px]">
                                    {errors.role.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="group flex flex-col gap-1">
                        <label htmlFor="status" className="text-text-primary text-sm font-semibold">
                            Status
                        </label>
                        <Select
                            id="status"
                            hasError={!!errors.status}
                            {...register('status')}
                            className="group-hover:border-input-hover transition-all duration-200"
                        >
                            <option value="">Select status</option>
                            {Object.values(ActivationStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </Select>

                        <div className="min-h-[18px] w-full pt-1 sm:min-h-[20px]">
                            {errors.status?.message && (
                                <p className="text-error w-full ps-2 text-left text-[10px] leading-tight sm:text-[12px]">
                                    {errors.status.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="min-h-[20px] w-full">
                        {updateUserMutation.isError && (
                            <p className="text-error w-full text-center text-[10px] sm:text-[12px]">
                                Failed to update user. Please try again.
                            </p>
                        )}
                    </div>
                    <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <div className="group sm:w-auto">
                            <Button
                                type="button"
                                onClick={handleCancel}
                                disabled={updateUserMutation.isPending}
                                className="text-text-primary hover:bg-input-hover bg-transparent transition-all duration-200 group-hover:-translate-y-0.5 sm:w-auto"
                            >
                                Cancel
                            </Button>
                        </div>
                        <div className="group sm:w-auto">
                            <Button
                                type="submit"
                                disabled={updateUserMutation.isPending}
                                className="hover:bg-action-hover transition-all duration-200 group-hover:-translate-y-0.5 sm:w-auto"
                            >
                                Apply Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
