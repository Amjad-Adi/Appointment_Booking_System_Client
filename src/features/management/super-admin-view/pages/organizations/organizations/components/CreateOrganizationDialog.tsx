import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import {
    CreateDialog,
    type CreateDialogField,
} from '../../../../../../../components/CreateDialog.tsx';

import { createOrganizationSchema } from '../../../../../../../zod-schemas/organization.schema.ts';
import type { CreateOrganization } from '../../../../../../../models/organization.model.ts';

import { useCurrentUser } from '../../../../../hooks/users-hook.ts';
import { useCreateOrganization } from '../../../../../hooks/organization-hook.ts';

import {
    LocationPicker,
    type SelectedLocationData,
} from '../../organization-profile/components/LocationPicker.tsx';

type CreateOrgFormValues = {
    name: string;
    email: string;
    phoneNumber: string;
    bio: string;
    profilePicturePath?: string;
    location: {
        name: string;
        locationOnMap: [number, number];
        timezone: string;
    };
};

interface CreateOrganizationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateOrganizationDialog({
    open,
    onOpenChange,
}: CreateOrganizationDialogProps) {
    const { data: currentUser } = useCurrentUser();

    const createMutation = useCreateOrganization();

    const initialTimezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

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
        if (!currentUser?.uuid) {
            toast.error('You must be logged in to create an organization');
            return;
        }

        const payload: CreateOrganization = {
            ...values,
            organizationOwnerUuid: currentUser.uuid,
        };

        await toast.promise(
            createMutation.mutateAsync(payload),
            {
                loading: 'Creating your organization...',
                success: 'Organization created successfully',
                error: 'Failed to create organization',
            },
        );

        onOpenChange(false);
    }

    return (
        <CreateDialog<CreateOrgFormValues, CreateOrgFormValues>
            open={open}
            onOpenChange={onOpenChange}
            title="Create Organization"
            description="Set up your organization profile and branch location."
            resolver={zodResolver(createOrganizationSchema) as any}
            defaultValues={{
                name: '',
                email: currentUser?.email ?? '',
                phoneNumber: '',
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
