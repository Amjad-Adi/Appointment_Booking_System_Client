import { useMemo, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { BriefcaseBusiness } from 'lucide-react';

import { EditDialog, type EditDialogField } from '../../../../../../components/EditDialog.tsx';
import { ImagePicker } from '../../../../../../components/ImagePicker.tsx';

import { useUpdateOrganizationService } from '../../../../hooks/services-hook.ts';
import { useUpdateServiceJunctionCategories } from '../../../../hooks/service-junction-category-hook.ts';

import { createServiceFormSchema } from '../../../../../../zod-schemas/service.schema.ts';

import type { ServiceResponse } from '../../../../../../models/service.model.ts';
import type { ServiceCategoryResponse } from '../../../../../../models/service-category.model.ts';

import { ActivationStatus } from '../../../../../../models/enums/activation-status.ts';
import { activationStatusRecord } from '../../../../../../models/enums-mapping/activation-status.ts';

import { getApiErrorMessage, getApiFieldErrors } from '../../../../../../utlis/api-error.ts';

interface EditServiceDialogProps {
    organizationUuid?: string;
    service: ServiceResponse;
    categories: ServiceCategoryResponse[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const editServiceFormSchema = z
    .object({
        ...createServiceFormSchema.shape,
        status: z.enum(ActivationStatus),
    })
    .strict();

type EditServiceForm = z.input<typeof editServiceFormSchema>;
type EditServiceFormOutput = z.output<typeof editServiceFormSchema>;

export function EditServiceDialog({
    organizationUuid,
    service,
    categories,
    open,
    onOpenChange,
}: EditServiceDialogProps) {
    const updateMutation = useUpdateOrganizationService(organizationUuid as string);
    const updateCategoriesMutation = useUpdateServiceJunctionCategories(
        organizationUuid as string,
        service.uuid,
    );

    const [picture, setPicture] = useState<File | null>(null);

    const defaultValues = useMemo<EditServiceForm>(
        () => ({
            name: service.name,
            description: service.description,
            price: service.price,
            durationInMinutes: service.durationInMinutes,
            status: service.status,
            serviceCategoryUuids: (service.categories ?? []).map((category) => category.uuid),
        }),
        [service],
    );

    const fields = useMemo<readonly EditDialogField<EditServiceForm>[]>(
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
                type: 'text',
            },
            {
                name: 'durationInMinutes',
                label: 'Duration',
                type: 'text',
            },
            {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: Object.values(ActivationStatus).map((status) => ({
                    value: status,
                    label: activationStatusRecord[status],
                })),
                showPlaceholder: false,
            },
            {
                name: 'serviceCategoryUuids',
                label: 'Categories',
                type: 'multi-select',
                multiSelectOptions: categories.map((category) => ({
                    value: category.uuid,
                    label: category.name,
                    description: category.description,
                    imagePath: category.picturePath ?? undefined,
                })),
            },
        ],
        [categories],
    );

    async function handleSubmit(changedValues: Partial<EditServiceFormOutput>) {
        const { serviceCategoryUuids, ...serviceChanges } = changedValues;

        try {
            await toast.promise(
                (async () => {
                    if (Object.keys(serviceChanges).length > 0 || picture) {
                        await updateMutation.mutateAsync({
                            uuid: service.uuid,
                            ...serviceChanges,
                            picture,
                        });
                    }

                    if (serviceCategoryUuids) {
                        await updateCategoriesMutation.mutateAsync({ serviceCategoryUuids });
                    }
                })(),
                {
                    loading: 'Updating service...',
                    success: 'Service updated successfully',
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to update service'),
                },
            );
        } catch {
            return;
        }

        setPicture(null);
        onOpenChange(false);
    }

    const fieldErrors =
        getApiFieldErrors(updateMutation.error) ??
        getApiFieldErrors(updateCategoriesMutation.error);

    return (
        <EditDialog<EditServiceForm, EditServiceFormOutput>
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Service"
            description="Update this organization's service and the categories it belongs to."
            resolver={zodResolver(editServiceFormSchema)}
            defaultValues={defaultValues}
            fields={fields}
            topContent={
                <ImagePicker
                    file={picture}
                    onChange={setPicture}
                    currentPath={service.servicePicturePath}
                    label="Service picture"
                    fallback={
                        <BriefcaseBusiness className="size-7 text-muted-foreground" strokeWidth={1.6} />
                    }
                />
            }
            hasExternalChanges={picture !== null}
            submitLabel="Apply Changes"
            errorMessage={
                fieldErrors
                    ? undefined
                    : updateMutation.isError
                      ? getApiErrorMessage(updateMutation.error, 'Failed to update service')
                      : updateCategoriesMutation.isError
                        ? getApiErrorMessage(
                              updateCategoriesMutation.error,
                              'Failed to update service categories',
                          )
                        : undefined
            }
            fieldErrors={fieldErrors}
            onSubmit={handleSubmit}
        />
    );
}
