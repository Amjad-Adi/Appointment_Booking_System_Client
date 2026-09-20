import { useMemo } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import {
    CreateDialog,
    type CreateDialogField,
} from '../../../../../../components/CreateDialog.tsx';

import { useCreateOrganizationService } from '../../../../hooks/services-hook.ts';
import { useCreateServiceJunctionCategories } from '../../../../hooks/service-junction-category-hook.ts';
import { createServiceFormSchema } from '../../../../../../zod-schemas/service.schema.ts';

import type { ServiceCategoryResponse } from '../../../../../../models/service-category.model.ts';

interface CreateServiceDialogProps {
    organizationUuid?: string;
    categories: ServiceCategoryResponse[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type CreateServiceForm = z.input<typeof createServiceFormSchema>;
type CreateServiceFormOutput = z.output<typeof createServiceFormSchema>;

export function CreateServiceDialog({
    organizationUuid,
    categories,
    open,
    onOpenChange,
}: CreateServiceDialogProps) {
    const createMutation = useCreateOrganizationService(organizationUuid);

    const createJunctionMutation =
        useCreateServiceJunctionCategories(organizationUuid);

    const fields = useMemo<readonly CreateDialogField<CreateServiceForm>[]>(
        () => [
            {
                name: 'name',
                label: 'Name',
                type: 'text',
            },
            {
                name: 'description',
                label: 'Description',
                type: 'text',
            },
            {
                name: 'price',
                label: 'Price',
                type: 'number',
            },
            {
                name: 'durationInMinutes',
                label: 'Duration',
                type: 'number',
            },
            {
                name: 'serviceCategoryUuids',
                label: 'Categories',
                type: 'multi-select',
                multiSelectOptions: categories.map((category) => ({
                    value: category.uuid,
                    label: category.name,
                    description: category.description,
                    imagePath: category.picturePath,
                })),
            },
        ],
        [categories],
    );

    async function handleSubmit(values: CreateServiceFormOutput) {
        const { serviceCategoryUuids, ...service } = values;

        await toast.promise(
            (async () => {
                const createdService = await createMutation.mutateAsync(service);

                await createJunctionMutation.mutateAsync({
                    serviceUuid: createdService.uuid,
                    serviceCategoryUuids,
                });
            })(),
            {
                loading: 'Creating service...',
                success: 'Service created successfully',
                error: 'Failed to create service',
            },
        );

        onOpenChange(false);
    }

    return (
        <CreateDialog<CreateServiceForm, CreateServiceFormOutput>
            open={open}
            onOpenChange={onOpenChange}
            title="Create Service"
            description="Add a service and assign it to one or more categories."
            resolver={zodResolver(createServiceFormSchema)}
            defaultValues={{
                serviceCategoryUuids: [],
            }}
            fields={fields}
            submitLabel="Create Service"
            onSubmit={handleSubmit}
        />
    );
}
