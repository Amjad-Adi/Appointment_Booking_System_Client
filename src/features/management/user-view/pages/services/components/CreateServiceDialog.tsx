import { useMemo, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { BriefcaseBusiness } from 'lucide-react';

import {
    CreateDialog,
    type CreateDialogField,
} from '../../../../../../components/CreateDialog.tsx';
import { ImagePicker } from '../../../../../../components/ImagePicker.tsx';

import { useCreateOrganizationService } from '../../../../hooks/services-hook.ts';
import { useCreateServiceJunctionCategories } from '../../../../hooks/service-junction-category-hook.ts';
import { createServiceFormSchema } from '../../../../../../zod-schemas/service.schema.ts';
import { getApiErrorMessage, getApiFieldErrors } from '../../../../../../utlis/api-error.ts';

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

    const createJunctionMutation = useCreateServiceJunctionCategories(organizationUuid);

    const [picture, setPicture] = useState<File | null>(null);

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

        try {
            await toast.promise(
                (async () => {
                    const createdService = await createMutation.mutateAsync({
                        ...service,
                        picture,
                    });

                    await createJunctionMutation.mutateAsync({
                        serviceUuid: createdService.uuid,
                        serviceCategoryUuids,
                    });
                })(),
                {
                    loading: 'Creating service...',
                    success: 'Service created successfully',
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to create service'),
                },
            );
        } catch {
            return;
        }

        setPicture(null);
        onOpenChange(false);
    }

    const fieldErrors =
        getApiFieldErrors(createMutation.error) ??
        getApiFieldErrors(createJunctionMutation.error);

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
            topContent={
                <ImagePicker
                    file={picture}
                    onChange={setPicture}
                    label="Service picture"
                    fallback={
                        <BriefcaseBusiness className="size-7 text-muted-foreground" strokeWidth={1.6} />
                    }
                />
            }
            submitLabel="Create Service"
            errorMessage={
                fieldErrors
                    ? undefined
                    : createMutation.isError
                      ? getApiErrorMessage(createMutation.error, 'Failed to create service')
                      : createJunctionMutation.isError
                        ? getApiErrorMessage(
                              createJunctionMutation.error,
                              'Failed to assign service categories',
                          )
                        : undefined
            }
            fieldErrors={fieldErrors}
            onSubmit={handleSubmit}
        />
    );
}
