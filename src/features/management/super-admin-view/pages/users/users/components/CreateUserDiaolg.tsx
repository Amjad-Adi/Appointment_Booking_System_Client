import { useMemo } from 'react';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    CreateDialog,
    type CreateDialogField,
} from '../../../../../../../components/CreateDialog.tsx';

import { useCreateUserByAdmin } from '../../../../../hooks/users-hook.ts';
import {
    createUserByAdminSchema,
    createUserSchema,
} from '../../../../../../../zod-schemas/user.schema.ts';

import { Role } from '../../../../../../../models/enums/roles.ts';
import type { CreateUserByAdmin } from '../../../../../../../models/user.model.ts';

import toast from 'react-hot-toast';
import { Language } from '../../../../../../../models/enums/language.ts';

interface CreateUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface CreateUserErrorResponse {
    message?: string;
    fieldErrors?: Partial<Record<keyof CreateUserByAdmin, string>>;
}

const loading = 'Creating user...';
const success = 'User created successfully';
const error = 'Failed to create user';

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
    const createUserMutation = useCreateUserByAdmin();

    const fields = useMemo<readonly CreateDialogField<CreateUserByAdmin>[]>(
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
                        value: Language.ENGLISH,
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

    const errorResponse: CreateUserErrorResponse | undefined =
        axios.isAxiosError<CreateUserErrorResponse>(createUserMutation.error)
            ? createUserMutation.error.response?.data
            : undefined;

    const fieldErrors = errorResponse?.fieldErrors;

    const errorMessage =
        createUserMutation.isError && !fieldErrors ? (errorResponse?.message ?? error) : undefined;

    async function handleSubmit(values: CreateUserByAdmin) {
        const toastId = toast.loading(loading);
        try {
            await createUserMutation.mutateAsync(values);
            toast.success(success, {
                id: toastId,
            });
            onOpenChange(false);
        } catch (mutationError) {
            toast.dismiss(toastId);
            if (
                axios.isAxiosError<CreateUserErrorResponse>(mutationError) &&
                mutationError.response?.data?.fieldErrors
            ) {
                return;
            }
            toast.error(error);
        }
    }

    return (
        <CreateDialog<CreateUserByAdmin>
            open={open}
            onOpenChange={onOpenChange}
            title="Create User"
            description="Create a new user account."
            resolver={zodResolver(createUserByAdminSchema)}
            fields={fields}
            submitLabel="Create User"
            fieldErrors={fieldErrors}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
        />
    );
}
