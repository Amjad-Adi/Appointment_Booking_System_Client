import { useMemo } from 'react';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import {
    CreateDialog,
    type CreateDialogField,
} from '../../../../../../../components/CreateDialog.tsx';

import { useCreateOrganizationInvitation } from '../../../../../hooks/invitation-hook.ts';

import { createInvitationSchema } from '../../../../../../../zod-schemas/invitations.schema.ts';

import { Role } from '../../../../../../../models/enums/roles.ts';
import type { CreateInvitation } from '../../../../../../../models/invitation.model.ts';

interface CreateInvitationDialogProps {
    organizationUuid: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface CreateInvitationErrorResponse {
    message?: string;
    fieldErrors?: Partial<Record<keyof CreateInvitation, string>>;
}

const loading = 'Sending invitation...';
const success = 'Invitation sent successfully';
const error = 'Failed to send invitation';

function getDefaultExpiresAtUTC(): string {
    const date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const timezoneOffset = date.getTimezoneOffset();

    return new Date(date.getTime() - timezoneOffset * 60 * 1000).toISOString().slice(0, 16);
}

export function CreateInvitationDialog({
    organizationUuid,
    open,
    onOpenChange,
}: CreateInvitationDialogProps) {
    const createInvitationMutation = useCreateOrganizationInvitation(organizationUuid);

    const fields = useMemo<readonly CreateDialogField<CreateInvitation>[]>(
        () => [
            {
                name: 'email',
                label: 'Recipient Email',
                type: 'email',
                placeholder: 'Enter recipient email',
                description: 'The invitation will be sent to this email address.',
            },
            {
                name: 'role',
                label: 'Role',
                type: 'select',
                options: [
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
                ],
                placeholder: 'Select role',
            },
            {
                name: 'expiresAtUTC',
                label: 'Expires At',
                type: 'datetime-local',
                placeholder: 'Select expiration date and time',
                description: 'The invitation will no longer be valid after this date and time.',
            },
        ],
        [],
    );

    const errorResponse: CreateInvitationErrorResponse | undefined =
        axios.isAxiosError<CreateInvitationErrorResponse>(createInvitationMutation.error)
            ? createInvitationMutation.error.response?.data
            : undefined;

    const fieldErrors = errorResponse?.fieldErrors;

    const errorMessage =
        createInvitationMutation.isError && !fieldErrors
            ? (errorResponse?.message ?? error)
            : undefined;

    async function handleSubmit(values: CreateInvitation) {
        const toastId = toast.loading(loading);

        try {
            await createInvitationMutation.mutateAsync(values);

            toast.success(success, {
                id: toastId,
            });

            onOpenChange(false);
        } catch (mutationError) {
            toast.dismiss(toastId);

            if (
                axios.isAxiosError<CreateInvitationErrorResponse>(mutationError) &&
                mutationError.response?.data?.fieldErrors
            ) {
                return;
            }

            toast.error(error);
        }
    }

    return (
        <CreateDialog<CreateInvitation>
            open={open}
            onOpenChange={onOpenChange}
            title="Invite New Member"
            description="Send an email invitation to add a new member to this organization."
            resolver={zodResolver(createInvitationSchema)}
            defaultValues={{
                email: '',
                role: Role.WORKER,
                expiresAtUTC: getDefaultExpiresAtUTC(),
            }}
            fields={fields}
            submitLabel="Send Invitation"
            fieldErrors={fieldErrors}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
        />
    );
}
