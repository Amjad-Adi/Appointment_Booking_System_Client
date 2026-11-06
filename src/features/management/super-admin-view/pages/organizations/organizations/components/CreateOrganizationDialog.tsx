import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { z } from 'zod';

import {
    CreateDialog,
    type CreateDialogField,
} from '../../../../../../../components/CreateDialog.tsx';
import { ImagePicker } from '../../../../../../../components/ImagePicker.tsx';

import { createOrganizationByAdminSchema } from '../../../../../../../zod-schemas/organization.schema.ts';
import type { CreateOrganizationByAdmin } from '../../../../../../../models/organization.model.ts';

import { useCreateOrganizationBySuperAdmin } from '../../../../../hooks/organization-hook.ts';
import { getApiErrorMessage, getApiFieldErrors } from '../../../../../../../utlis/api-error.ts';

const createOrganizationByAdminFormSchema = createOrganizationByAdminSchema.extend({
    bio: z.string().trim().max(4096).optional().or(z.literal('')),
});

type CreateOrgFormValues = z.infer<typeof createOrganizationByAdminFormSchema>;

interface CreateOrganizationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateOrganizationDialog({ open, onOpenChange }: CreateOrganizationDialogProps) {
    const createMutation = useCreateOrganizationBySuperAdmin();
    const [picture, setPicture] = useState<File | null>(null);

    const initialTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

    const fields: readonly CreateDialogField<CreateOrgFormValues>[] = [
        {
            name: 'name',
            label: 'Organization Name',
            type: 'text',
        },
        {
            name: 'email',
            label: 'Contact Email',
            type: 'text',
        },
        {
            name: 'userEmail',
            label: 'Owner Email',
            type: 'text',
        },
        {
            name: 'phoneNumber',
            label: 'Phone Number',
            type: 'text',
        },
        {
            name: 'bio',
            label: 'Bio',
            type: 'text',
        },
        {
            name: 'location.name',
            label: 'Location Name',
            type: 'text',
        },
    ];

    async function handleSubmit(values: CreateOrgFormValues) {
        const payload: CreateOrganizationByAdmin = {
            ...values,
            bio: values.bio?.trim() || undefined,
        };

        try {
            await toast.promise(createMutation.mutateAsync({ ...payload, picture }), {
                loading: 'Creating organization...',
                success: 'Organization created successfully',
                error: (mutationError) =>
                    getApiErrorMessage(mutationError, 'Failed to create organization'),
            });
        } catch {
            return;
        }

        setPicture(null);
        onOpenChange(false);
    }

    return (
        <CreateDialog<CreateOrgFormValues, CreateOrgFormValues>
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    setPicture(null);
                }
                onOpenChange(nextOpen);
            }}
            title="Create Organization"
            description="Set up your organization profile and branch location."
            topContent={
                <div className="mb-4">
                    <ImagePicker
                        file={picture}
                        onChange={setPicture}
                        label="Organization Picture"
                    />
                </div>
            }
            resolver={zodResolver(createOrganizationByAdminFormSchema)}
            defaultValues={{
                name: '',
                email: '',
                phoneNumber: '',
                userEmail: '',
                bio: '',
                location: {
                    name: '',
                    locationOnMap: [35.2034, 31.9038],
                    timezone: initialTimezone,
                },
            }}
            fields={fields}
            submitLabel="Create Organization"
            errorMessage={
                createMutation.isError && !getApiFieldErrors(createMutation.error)
                    ? getApiErrorMessage(createMutation.error, 'Failed to create organization')
                    : undefined
            }
            fieldErrors={getApiFieldErrors(createMutation.error)}
            onSubmit={handleSubmit}
        />
    );
}
