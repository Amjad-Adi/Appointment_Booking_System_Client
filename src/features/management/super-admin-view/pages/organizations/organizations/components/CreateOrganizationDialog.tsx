import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import type { z } from 'zod';

import {
    CreateDialog,
    type CreateDialogField,
} from '../../../../../../../components/CreateDialog.tsx';

import { createOrganizationByAdminSchema } from '../../../../../../../zod-schemas/organization.schema.ts';
import type { CreateOrganizationByAdmin } from '../../../../../../../models/organization.model.ts';

import { useCreateOrganizationBySuperAdmin } from '../../../../../hooks/organization-hook.ts';

type CreateOrgFormValues = z.infer<typeof createOrganizationByAdminSchema>;

interface CreateOrganizationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateOrganizationDialog({ open, onOpenChange }: CreateOrganizationDialogProps) {
    const createMutation = useCreateOrganizationBySuperAdmin();

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

        await toast.promise(createMutation.mutateAsync(payload), {
            loading: 'Creating organization...',
            success: 'Organization created successfully',
            error: 'Failed to create organization',
        });

        onOpenChange(false);
    }

    return (
        <CreateDialog<CreateOrgFormValues, CreateOrgFormValues>
            open={open}
            onOpenChange={onOpenChange}
            title="Create Organization"
            description="Set up your organization profile and branch location."
            resolver={zodResolver(createOrganizationByAdminSchema)}
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
            onSubmit={handleSubmit}
        />
    );
}
