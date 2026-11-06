import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, Check, ShieldCheck } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import type {
    OrganizationResponse,
    UpdateOrganization,
} from '../../../../../../../models/organization.model.ts';
import { ActivationStatus } from '../../../../../../../models/enums/activation-status.ts';

import { Button } from '../../../../../../../components/Button.tsx';
import { Select } from '../../../../../../../components/Select.tsx';
import { TextField } from '../../../../../../../components/TextField.tsx';
import { Label } from '../../../../../../../components/Label.tsx';
import { ImagePicker } from '../../../../../../../components/ImagePicker.tsx';
import { getApiErrorMessage } from '../../../../../../../utlis/api-error.ts';

import { useUpdateOrganization } from '../../../../../hooks/organization-hook.ts';

import { OrganizationProfileHeader } from './OrganizationProfileHeader.tsx';
import { OrganizationLocationCard } from './OrganizationLocationCard.tsx';
import { OrganizationWorkingHoursCard } from './working-hours/OrganizationWorkingHoursCard.tsx';
import { OrganizationTimeInfo } from './OrganizationTimeInfo.tsx';
import { LocationPicker, type SelectedLocationData } from './LocationPicker.tsx';

import {
    updateOrganizationByAdminSchema,
    updateOrganizationSchema,
} from '../../../../../../../zod-schemas/organization.schema.ts';
import { ActivationStatusRender } from '../../../../../components/ActivationStatusRender.tsx';

interface EditOrganizationProfileProps {
    organization: OrganizationResponse;
    canEditStatus?: boolean;
    canEditDetails?: boolean;
    canEditWorkingHours?: boolean;
    onEditWorkingHours?: () => void;
    onClose?: () => void;
}

interface FormValues {
    status: ActivationStatus;
    name: string;
    phoneNumber: string;
    bio: string;
    location: {
        name: string;
        locationOnMap: [number | null, number | null]; // [longitude, latitude]
        timezone: string;
    };
}

const editOrganizationFormSchema = z.object({
    status: z.enum(ActivationStatus),
    name: z.string().trim().max(256),
    phoneNumber: z.string().trim(),
    bio: z.string().trim().max(4096),
    location: z.object({
        name: z.string().trim().max(1024),
        locationOnMap: z.tuple([z.number().nullable(), z.number().nullable()]),
        timezone: z.string().trim().min(1),
    }),
});

const loadingMessage = 'Updating organization...';
const successMessage = 'Organization updated successfully';
const errorMessage = 'Failed to update organization';

export function EditOrganizationProfile({
    organization,
    canEditStatus = false,
    canEditDetails = false,
    canEditWorkingHours = false,
    onEditWorkingHours,
    onClose,
}: EditOrganizationProfileProps) {
    const updateOrganizationMutation = useUpdateOrganization();
    const [picture, setPicture] = useState<File | null>(null);

    const [origLongitude = null, origLatitude = null] = organization.location?.locationOnMap ?? [
        null,
        null,
    ];

    const defaultValues: FormValues = {
        status: organization.status,
        name: organization.name ?? '',
        phoneNumber: organization.phoneNumber ?? '',
        bio: organization.bio ?? '',
        location: {
            name: organization.location?.name ?? '',
            locationOnMap: [origLongitude, origLatitude],
            timezone: organization.location?.timezone ?? 'UTC',
        },
    };

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { isSubmitting, isDirty, errors },
    } = useForm<FormValues>({
        resolver: zodResolver(editOrganizationFormSchema) as any,
        defaultValues,
    });

    const watchedLocation = watch('location.locationOnMap');
    const [currentLng, currentLat] = watchedLocation ?? [origLongitude, origLatitude];

    useEffect(() => {
        reset(defaultValues);
    }, [organization, reset]);

    const handleLocationChange = (data: SelectedLocationData) => {
        setValue('location.name', data.name, { shouldDirty: true });
        setValue('location.locationOnMap', [data.longitude, data.latitude], { shouldDirty: true });
        setValue('location.timezone', data.timezone, { shouldDirty: true });
    };

    const handleSubmitForm = async (values: FormValues) => {
        const changedValues: Record<string, unknown> = {};

        if (canEditStatus && values.status !== organization.status) {
            changedValues.status = values.status;
        }

        if (canEditDetails) {
            if (values.name && values.name !== organization.name) {
                changedValues.name = values.name;
            }
            if (values.phoneNumber && values.phoneNumber !== organization.phoneNumber) {
                changedValues.phoneNumber = values.phoneNumber;
            }
            if (values.bio && values.bio !== organization.bio) {
                changedValues.bio = values.bio;
            }

            const locationPayload: Record<string, unknown> = {};
            if (values.location.name !== (organization.location?.name ?? '')) {
                locationPayload.name = values.location.name;
            }
            if (
                values.location.locationOnMap[0] !== origLongitude ||
                values.location.locationOnMap[1] !== origLatitude
            ) {
                locationPayload.locationOnMap = values.location.locationOnMap;
            }
            if (values.location.timezone !== (organization.location?.timezone ?? 'UTC')) {
                locationPayload.timezone = values.location.timezone;
            }

            if (Object.keys(locationPayload).length > 0) {
                changedValues.location = locationPayload;
            }
        }

        if (Object.keys(changedValues).length === 0 && picture === null) {
            onClose?.();
            return;
        }

        if (Object.keys(changedValues).length === 0) {
            // The server requires at least one body field alongside the uploaded file.
            if (canEditStatus) {
                changedValues.status = organization.status;
            } else {
                changedValues.name = organization.name;
            }
        }

        let payload: Record<string, unknown> = changedValues;

        if (picture === null) {
            const payloadSchema = canEditStatus
                ? updateOrganizationByAdminSchema
                : updateOrganizationSchema;

            const validation = payloadSchema.safeParse(changedValues);

            if (!validation.success) {
                toast.error(validation.error.issues[0]?.message ?? errorMessage);
                return;
            }

            payload = validation.data;
        }

        try {
            await toast.promise(
                updateOrganizationMutation.mutateAsync({
                    ...(payload as UpdateOrganization),
                    uuid: organization.uuid,
                    picture,
                }),
                {
                    loading: loadingMessage,
                    success: successMessage,
                    error: (mutationError) => getApiErrorMessage(mutationError, errorMessage),
                },
            );

            setPicture(null);
            onClose?.();
        } catch {
            // Keep state on failure
        }
    };

    const timeZone = organization.location?.timezone || 'UTC';

    return (
        <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="flex min-w-0 flex-1 flex-col gap-4"
        >
            <div className="flex min-w-0 items-center justify-between gap-3">
                <Button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 border border-border bg-transparent px-3 text-[11px] font-semibold text-secondary-foreground hover:bg-secondary hover:text-foreground"
                >
                    <ArrowLeft className="size-3.5 transition-colors group-hover:text-foreground" />
                    Close
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting || (!isDirty && picture === null)}
                    className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 px-3 text-[11px] font-semibold"
                >
                    <Check className="size-3.5 transition-colors" />
                    Save
                </Button>
            </div>

            <OrganizationTimeInfo timeZone={timeZone} />

            <OrganizationProfileHeader organization={organization} />

            <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
                <div className="min-w-0">
                    <h3 className="text-[13px] font-semibold text-foreground">Organization Picture</h3>
                    <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                        Upload a new picture to replace the current one.
                    </p>
                </div>

                <div className="mt-4">
                    <ImagePicker
                        file={picture}
                        onChange={setPicture}
                        currentPath={organization.profilePicturePath}
                        label="Picture"
                        disabled={isSubmitting}
                    />
                </div>
            </section>

            {canEditDetails && (
                <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
                    <div className="min-w-0">
                        <h3 className="text-[13px] font-semibold text-foreground">
                            Organization Information
                        </h3>
                        <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                            General details and geographic coordinates.
                        </p>
                    </div>

                    <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            label="Organization Name"
                            id="name"
                            {...register('name')}
                            hasError={!!errors.name}
                            errorMessage={errors.name?.message}
                        />

                        <TextField
                            label="Phone Number"
                            id="phoneNumber"
                            {...register('phoneNumber')}
                            hasError={!!errors.phoneNumber}
                            errorMessage={errors.phoneNumber?.message}
                        />

                        <div className="sm:col-span-2">
                            <Label htmlFor="bio">Bio</Label>
                            <textarea
                                id="bio"
                                rows={3}
                                {...register('bio')}
                                className="w-full rounded-lg border border-border bg-card p-2.5 text-[11px] text-foreground focus:border-ring focus:outline-none"
                            />
                        </div>

                        <TextField
                            label="Location Name"
                            id="locationName"
                            wrapperClassName="sm:col-span-2"
                            {...register('location.name')}
                        />

                        {/* OpenStreetMap Location Picker */}
                        <LocationPicker
                            latitude={currentLat}
                            longitude={currentLng}
                            onSelectLocation={handleLocationChange}
                        />
                    </div>
                </section>
            )}

            {!canEditDetails && <OrganizationLocationCard location={organization.location} />}
            <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
                <div className="min-w-0">
                    <h3 className="text-[13px] font-semibold text-foreground">
                        Account Information
                    </h3>
                    <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                        Administrative information associated with this organization.
                    </p>
                </div>

                <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
                    <AccountItem
                        icon={<ShieldCheck className="size-4" />}
                        label="Status"
                        value={<ActivationStatusRender status={organization.status} />}
                    />

                    <AccountItem
                        icon={<CalendarDays className="size-4" />}
                        label="Created"
                        value={formatDate(organization.createdAtUTC)}
                    />

                    <AccountItem
                        icon={<CalendarDays className="size-4" />}
                        label="Last Updated"
                        value={formatDate(organization.updatedAtUTC)}
                    />
                </div>
            </section>
        </form>
    );
}

function AccountItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground">
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-[9px] font-medium tracking-wide text-muted-foreground uppercase">
                    {label}
                </p>

                <div className="mt-0.5 truncate text-[11px] font-medium text-secondary-foreground">
                    {value}
                </div>
            </div>
        </div>
    );
}

function formatDate(value: Date | string) {
    return new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
