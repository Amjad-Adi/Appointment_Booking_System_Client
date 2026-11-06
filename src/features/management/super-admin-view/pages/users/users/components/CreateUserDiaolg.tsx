import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

import {
    CreateDialog,
    type CreateDialogField,
} from '../../../../../../../components/CreateDialog.tsx';
import { ImagePicker } from '../../../../../../../components/ImagePicker.tsx';

import { useCreateUserByAdmin } from '../../../../../hooks/users-hook.ts';
import { createUserByAdminSchema } from '../../../../../../../zod-schemas/user.schema.ts';

import { Role } from '../../../../../../../models/enums/roles.ts';
import type { CreateUserByAdmin } from '../../../../../../../models/user.model.ts';
import { getApiErrorMessage, getApiFieldErrors } from '../../../../../../../utlis/api-error.ts';

import toast from 'react-hot-toast';

interface CreateUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type CreateUserFormValues = z.input<typeof createUserByAdminSchema>;

const loading = 'Creating user...';
const success = 'User created successfully';
const error = 'Failed to create user';

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
    const createUserMutation = useCreateUserByAdmin();
    const [picture, setPicture] = useState<File | null>(null);

    const fields = useMemo<readonly CreateDialogField<CreateUserFormValues>[]>(
        () => [
            {
                name: 'firstName',
                label: 'First Name',
                type: 'text',
                placeholder: 'Enter first name',
            },
            {
                name: 'lastName',
                label: 'Last Name',
                type: 'text',
                placeholder: 'Enter last name',
            },
            {
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'Enter email',
            },
            {
                name: 'password',
                label: 'Password',
                type: 'password',
                placeholder: 'Enter password',
            },
            {
                name: 'confirmPassword',
                label: 'Confirm Password',
                type: 'password',
                placeholder: 'Confirm password',
            },
            {
                name: 'role',
                label: 'Role',
                type: 'select',
                options: [
                    {
                        value: Role.CUSTOMER,
                        label: Role.CUSTOMER,
                    },
                    {
                        value: Role.WORKER,
                        label: Role.WORKER,
                    },
                    {
                        value: Role.CRM,
                        label: Role.CRM,
                    },
                    {
                        value: Role.MANAGER,
                        label: Role.MANAGER,
                    },
                    {
                        value: Role.OWNER,
                        label: Role.OWNER,
                    },
                    {
                        value: Role.SUPER_ADMIN,
                        label: Role.SUPER_ADMIN,
                    },
                ],
                placeholder: 'Select role',
            },
        ],
        [],
    );

    const fieldErrors = getApiFieldErrors(createUserMutation.error);

    const errorMessage =
        createUserMutation.isError && !fieldErrors
            ? getApiErrorMessage(createUserMutation.error, error)
            : undefined;

    async function handleSubmit(values: CreateUserByAdmin) {
        const toastId = toast.loading(loading);

        try {
            await createUserMutation.mutateAsync({ ...values, profilePicture: picture });
            toast.success(success, {
                id: toastId,
            });
            setPicture(null);
            onOpenChange(false);
        } catch (mutationError) {
            toast.dismiss(toastId);

            if (getApiFieldErrors(mutationError)) {
                return;
            }

            toast.error(getApiErrorMessage(mutationError, error));
        }
    }

    return (
        <CreateDialog<CreateUserFormValues, CreateUserByAdmin>
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    setPicture(null);
                }
                onOpenChange(nextOpen);
            }}
            title="Create User"
            description="Create a new user account."
            topContent={
                <div className="mb-4">
                    <ImagePicker
                        file={picture}
                        onChange={setPicture}
                        label="Profile Picture"
                        rounded="full"
                    />
                </div>
            }
            resolver={zodResolver(createUserByAdminSchema)}
            fields={fields}
            submitLabel="Create User"
            fieldErrors={fieldErrors}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
        />
    );
}
