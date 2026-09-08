import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '../../../../../components/TextField.tsx';
import { Select } from '../../../../../components/Select.tsx';
import { Button } from '../../../../../components/Button.tsx';
import { useUpdateUser } from '../../../hooks/users/users-hook.ts';
import { updateUserByAdminSchema } from '../../../../../zod-schemas/user.schema.ts';
import { Role } from '../../../../../models/enums/roles.ts';
import { ActivationStatus } from '../../../../../models/enums/activation-status.ts';
import type {
    UserResponse,
    UpdateUser,
    UpdateUserByAdmin,
    UpdateUserByAdminForm,
} from '../../../../../models/user.model.ts';

interface EditUserDialogProps {
    user: UserResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
    const updateUserMutation = useUpdateUser();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateUserByAdminForm>({
        resolver: zodResolver(updateUserByAdminSchema),
        defaultValues: {
            role: user.role,
            status: user.status,
        },
    });

    useEffect(() => {
        reset({
            role: user.role,
            status: user.status,
        });
    }, [user, reset]);

    if (!open) {
        return null;
    }
    const onSubmit = (data: UpdateUserByAdminForm) => {
        console.log('FORM DATA:', data);

        const payload = {
            uuid: user.uuid,
            ...data,
        };

        console.log('MUTATION PAYLOAD:', payload);

        updateUserMutation.mutate(payload);
    };
    const handleCancel = () => {
        reset({
            role: user.role,
            status: user.status,
        });

        onOpenChange(false);
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
        >
            <div className="border-input-border bg-background w-full max-w-lg rounded-xl border p-6 shadow-2xl">
                <div className="mb-6">
                    <h2 id="edit-user-title" className="text-text-primary text-xl font-bold">
                        Edit User
                    </h2>

                    <p className="text-text-secondary mt-1 text-sm">
                        Update the user's role and activation status.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                    <div className="flex flex-col gap-1">
                        <label htmlFor="role" className="text-text-primary text-sm font-semibold">
                            Role
                        </label>

                        <Select id="role" hasError={!!errors.role} {...register('role')}>
                            <option value="">Select role</option>

                            {Object.values(Role).map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </Select>

                        {errors.role?.message && (
                            <p className="text-error text-xs">{errors.role.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="status" className="text-text-primary text-sm font-semibold">
                            Status
                        </label>

                        <Select id="status" hasError={!!errors.status} {...register('status')}>
                            <option value="">Select status</option>

                            {Object.values(ActivationStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </Select>

                        {errors.status?.message && (
                            <p className="text-error text-xs">{errors.status.message}</p>
                        )}
                    </div>

                    {updateUserMutation.isError && (
                        <p className="text-error text-center text-sm">
                            Failed to update user. Please try again.
                        </p>
                    )}

                    <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            onClick={handleCancel}
                            disabled={updateUserMutation.isPending}
                            className="text-text-primary hover:bg-input-hover bg-transparent sm:w-auto"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={updateUserMutation.isPending}
                            className="hover:bg-action-hover sm:w-auto"
                        >
                            {updateUserMutation.isPending ? 'Applying...' : 'Apply Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
