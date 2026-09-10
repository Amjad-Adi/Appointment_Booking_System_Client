import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { TextField } from '../../../../../../components/TextField.tsx';
import { Select } from '../../../../../../components/Select.tsx';
import { Button } from '../../../../../../components/Button.tsx';

import { useUpdateUser } from '../../../../hooks/users-hook.ts';
import { updateUserByAdminSchema } from '../../../../../../zod-schemas/user.schema.ts';

import { Role } from '../../../../../../models/enums/roles.ts';
import { ActivationStatus } from '../../../../../../models/enums/activation-status.ts';

import type { UserResponse, UpdateUserByAdminForm } from '../../../../../../models/user.model.ts';
import toast from 'react-hot-toast';
import { Toast } from '../../../../../../utlis/toast.ts';
import { Label } from '../../../../../../components/Label.tsx';

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
            className="fixed inset-0 z-2 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-4 backdrop-blur-[2px] sm:py-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
        >
            <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-[#d3d3df] bg-[#f5f5f8] shadow-2xl">
                <div className="shrink-0 border-b border-[#d3d3df] px-5 py-4 sm:px-6">
                    <h2
                        id="edit-user-title"
                        className="text-[15px] font-semibold tracking-tight text-[#343447]"
                    >
                        Edit User
                    </h2>

                    <p className="mt-0.5 text-[11px] leading-4 text-[#777789]">
                        Update the user's role and activation status.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex min-h-0 flex-col overflow-y-auto px-5 py-4 sm:px-6 sm:py-5"
                >
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                            <TextField
                                label="First Name"
                                id="firstName"
                                value={user.firstName}
                                disabled
                            />

                            <TextField
                                label="Last Name"
                                id="lastName"
                                value={user.lastName}
                                disabled
                            />
                        </div>

                        <TextField
                            label="Email"
                            id="email"
                            type="email"
                            value={user.email}
                            disabled
                        />
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                            <div className="w-full">
                                <Label htmlFor="role">Role</Label>

                                <Select
                                    id="role"
                                    hasError={!!errors.role}
                                    {...register('role')}
                                    className="h-8 px-2.5 text-[11px] sm:h-8 sm:px-2.5 sm:text-[11px] md:h-8 md:text-[11px]"
                                >
                                    <option value="">Select role</option>

                                    {Object.values(Role).map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            <div className="w-full">
                                <Label htmlFor="status">Status</Label>

                                <Select
                                    id="status"
                                    hasError={!!errors.status}
                                    {...register('status')}
                                    className="h-8 px-2.5 text-[11px] sm:h-8 sm:px-2.5 sm:text-[11px] md:h-8 md:text-[11px]"
                                >
                                    <option value="">Select status</option>

                                    {Object.values(ActivationStatus).map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        {updateUserMutation.isError && (
                            <p className="w-full pt-1 text-center text-[10px] leading-4 text-[#c94a5c]">
                                Failed to update user. Please try again.
                            </p>
                        )}
                    </div>

                    <div className="mt-3 flex shrink-0 flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <div className="group sm:w-auto">
                            <Button
                                type="button"
                                onClick={handleCancel}
                                disabled={updateUserMutation.isPending}
                                className="h-8 w-full border border-[#d3d3df] bg-transparent px-3 text-[11px] font-semibold text-[#454556] hover:bg-[#ededf2] hover:text-[#343447] sm:h-8 sm:w-auto sm:px-3 sm:text-[11px] md:h-8 md:w-auto md:px-3 md:text-[11px]"
                            >
                                Cancel
                            </Button>
                        </div>

                        <div className="group sm:w-auto">
                            <Button
                                type="submit"
                                disabled={updateUserMutation.isPending}
                                className="h-8 w-full px-3 text-[11px] font-semibold sm:h-8 sm:w-auto sm:px-3 sm:text-[11px] md:h-8 md:w-auto md:px-3 md:text-[11px]"
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
