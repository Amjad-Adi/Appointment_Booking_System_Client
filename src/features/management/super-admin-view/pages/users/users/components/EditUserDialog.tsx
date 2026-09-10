import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { TextField } from '../../../../../../../components/TextField.tsx';
import { EditDialog, type EditDialogField } from '../../../../../../../components/EditDialog.tsx';

import { useUpdateUser } from '../../../../../hooks/users-hook.ts';
import { updateUserByAdminSchema } from '../../../../../../../zod-schemas/user.schema.ts';

import { Role } from '../../../../../../../models/enums/roles.ts';
import { ActivationStatus } from '../../../../../../../models/enums/activation-status.ts';

import type {
    UserResponse,
    UpdateUserByAdminForm,
} from '../../../../../../../models/user.model.ts';

import toast from 'react-hot-toast';
import { Toast } from '../../../../../../../utlis/toast.ts';

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

    const defaultValues = useMemo<UpdateUserByAdminForm>(
        () => ({
            role: user.role,
            status: user.status,
        }),
        [user.role, user.status],
    );

    const fields = useMemo<readonly EditDialogField<UpdateUserByAdminForm>[]>(
        () => [
            {
                name: 'role',
                label: 'Role',
                type: 'select',
                options: Object.values(Role).map((role) => ({
                    value: role,
                    label: role,
                })),
                placeholder: 'Select role',
            },
            {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: Object.values(ActivationStatus).map((status) => ({
                    value: status,
                    label: status,
                })),
                placeholder: 'Select status',
            },
        ],
        [],
    );

    const handleSubmit = async (changedValues: Partial<UpdateUserByAdminForm>) => {
        await toast.promise(
            updateUserMutation.mutateAsync({
                uuid: user.uuid,
                ...changedValues,
            }),
            new Toast(loading, success, error),
        );

        onOpenChange(false);
    };

    return (
        <EditDialog<UpdateUserByAdminForm>
            open={open}
            onOpenChange={onOpenChange}
            title="Edit User"
            description="Update the user's role and activation status."
            resolver={zodResolver(updateUserByAdminSchema)}
            defaultValues={defaultValues}
            fields={fields}
            submitLabel="Apply Changes"
            errorMessage={
                updateUserMutation.isError ? 'Failed to update user. Please try again.' : undefined
            }
            onSubmit={handleSubmit}
            readOnlyContent={
                <>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                        <TextField
                            label="First Name"
                            id="firstName"
                            value={user.firstName}
                            disabled
                        />

                        <TextField label="Last Name" id="lastName" value={user.lastName} disabled />
                    </div>

                    <TextField label="Email" id="email" type="email" value={user.email} disabled />
                </>
            }
        />
    );
}
