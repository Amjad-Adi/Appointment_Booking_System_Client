import { useNavigate } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Building2, Check, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { TextField } from '../../../../../../../../components/TextField.tsx';
import { Button } from '../../../../../../../../components/Button.tsx';
import { ImagePicker } from '../../../../../../../../components/ImagePicker.tsx';
import { LocationPicker } from '../../../organization-profile/components/LocationPicker.tsx';

import {
    createOrganizationByAdminSchema,
    createOrganizationSchema,
} from '../../../../../../../../zod-schemas/organization.schema.ts';
import { useCreateOrganization } from '../../../../../../hooks/organization-hook.ts';
import { useCurrentUser } from '../../../../../../hooks/users-hook.ts';

import { getApiErrorMessage } from '../../../../../../../../utlis/api-error.ts';

import type {
    CreateOrganization,
    CreateOrganizationByAdmin,
} from '../../../../../../../../models/organization.model.ts';
import { Role } from '../../../../../../../../models/enums/roles.ts';

const optionalBioSchema = z.string().trim().max(4096).optional().or(z.literal(''));

const createOrganizationFormSchema = createOrganizationSchema.extend({
    bio: optionalBioSchema,
});

const createOrganizationByAdminFormSchema = createOrganizationByAdminSchema.extend({
    bio: optionalBioSchema,
});

type FormValues = {
    name: string;
    email: string;
    phoneNumber: string;
    bio?: string;
    userEmail?: string;
    location: {
        name: string;
        locationOnMap: [number, number];
        timezone: string;
    };
};

export function CreateOrganizationForm() {
    const navigate = useNavigate();
    const createMutation = useCreateOrganization();
    const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();

    const isSuperAdmin = currentUser?.role === Role.SUPER_ADMIN;

    const [locationSelected, setLocationSelected] = useState(false);
    const [picture, setPicture] = useState<File | null>(null);

    const defaultValues: FormValues = {
        name: '',
        email: '',
        phoneNumber: '',
        bio: '',
        ...(isSuperAdmin ? { userEmail: '' } : {}),
        location: {
            name: '',
            locationOnMap: [35.2034, 31.9038],
            timezone: 'Asia/Hebron',
        },
    };

    const { register, control, handleSubmit, formState, setError } = useForm<FormValues>({
        resolver: zodResolver(
            (isSuperAdmin
                ? createOrganizationByAdminFormSchema
                : createOrganizationFormSchema) as any,
        ) as any,
        defaultValues,
    });

    async function submitOrganization(values: FormValues) {
        if (!locationSelected) {
            setError('location', {
                type: 'manual',
                message: 'Please select your business location.',
            });
            return;
        }

        const basePayload = {
            name: values.name,
            email: values.email,
            phoneNumber: values.phoneNumber,
            bio: values.bio?.trim() || undefined,
            location: values.location as CreateOrganization['location'],
        };

        const schema = isSuperAdmin ? createOrganizationByAdminSchema : createOrganizationSchema;

        const validation = schema.safeParse(
            isSuperAdmin ? { ...basePayload, userEmail: values.userEmail } : basePayload,
        );

        if (!validation.success) {
            toast.error('Please check the organization details.');
            return;
        }

        try {
            await toast.promise(
                createMutation.mutateAsync({
                    ...(validation.data as CreateOrganizationByAdmin | CreateOrganization),
                    picture,
                }),
                {
                    loading: 'Creating organization...',
                    success: 'Organization created successfully!',
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to create organization.'),
                },
            );

            navigate(isSuperAdmin ? '/admin/organizations' : '/organization', {
                replace: true,
            });
        } catch {
            // Error is already displayed by toast.
        }
    }

    const errorClass = 'mt-1 text-[10px] text-destructive';

    return (
        <form onSubmit={handleSubmit(submitOrganization)} className="flex min-w-0 flex-col gap-4">
            {/* Actions */}
            <div className="flex min-w-0 items-center justify-end gap-2">
                <Button
                    type="button"
                    onClick={() => navigate(-1)}
                    disabled={createMutation.isPending}
                    className="h-8 w-auto shrink-0 border border-border bg-transparent px-3 text-[11px] font-semibold text-secondary-foreground hover:bg-secondary hover:text-foreground"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={createMutation.isPending || currentUserLoading}
                    className="flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 px-3 text-[11px] font-semibold"
                >
                    <Check className="size-3.5" strokeWidth={2} />

                    {createMutation.isPending ? 'Creating...' : 'Create Organization'}
                </Button>
            </div>

            {/* Business Information */}
            <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground">
                        <Building2 className="size-4" strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-[13px] font-semibold text-foreground">
                            Business Information
                        </h3>

                        <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                            Enter your organization's basic details.
                        </p>
                    </div>
                </div>

                <div className="mt-5">
                    <ImagePicker
                        file={picture}
                        onChange={setPicture}
                        label="Organization Picture"
                        description="Optional. PNG, JPG or WEBP uploaded to Cloudinary."
                        disabled={createMutation.isPending}
                    />
                </div>

                <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField
                        label="Organization Name"
                        id="organization_name"
                        type="text"
                        placeholder="Organization name"
                        errorMessage={formState.errors.name?.message}
                        {...register('name')}
                    />

                    <TextField
                        label="Contact Email"
                        id="organization_email"
                        type="email"
                        placeholder="Business email"
                        errorMessage={formState.errors.email?.message}
                        {...register('email')}
                    />

                    {isSuperAdmin ? (
                        <TextField
                            label="Owner Email"
                            id="organization_owner_email"
                            type="email"
                            placeholder="Owner email"
                            errorMessage={formState.errors.userEmail?.message}
                            {...register('userEmail')}
                        />
                    ) : null}

                    <TextField
                        label="Phone Number"
                        id="organization_phone"
                        type="tel"
                        placeholder="+970XXXXXXXXX"
                        errorMessage={formState.errors.phoneNumber?.message}
                        {...register('phoneNumber')}
                    />

                    <div className="sm:col-span-2">
                        <label
                            htmlFor="organization_bio"
                            className="text-[11px] font-medium text-foreground"
                        >
                            Description
                            <span className="ml-1 font-normal text-muted-foreground">(Optional)</span>
                        </label>

                        <textarea
                            id="organization_bio"
                            rows={3}
                            maxLength={4096}
                            placeholder="Describe your organization..."
                            className="mt-1.5 w-full resize-y rounded-lg border border-border bg-card p-2.5 text-[11px] text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:border-ring"
                            {...register('bio')}
                        />

                        {formState.errors.bio && (
                            <p className={errorClass}>{formState.errors.bio.message}</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Business Location */}
            <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground">
                        <MapPin className="size-4" strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-[13px] font-semibold text-foreground">
                            Business Location
                        </h3>

                        <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                            Select your organization's location on the map.
                        </p>
                    </div>
                </div>

                <div className="mt-5 min-w-0">
                    <Controller
                        control={control}
                        name="location"
                        render={({ field }) => (
                            <div className="flex min-w-0 flex-col gap-3">
                                <LocationPicker
                                    latitude={field.value.locationOnMap[1]}
                                    longitude={field.value.locationOnMap[0]}
                                    onSelectLocation={(selected) => {
                                        field.onChange({
                                            name: selected.name,
                                            locationOnMap: [selected.longitude, selected.latitude],
                                            timezone: selected.timezone,
                                        });

                                        setLocationSelected(true);
                                    }}
                                    label="Organization Location"
                                    helperText="Click the map or drag the marker to select your location."
                                />

                                {locationSelected && (
                                    <div className="rounded-lg bg-card p-3">
                                        <p className="text-[11px] font-medium text-foreground">
                                            Selected Location
                                        </p>

                                        <p className="mt-1 text-[10px] break-words text-muted-foreground">
                                            {field.value.name || 'Unnamed location'}
                                        </p>

                                        <p className="mt-1 text-[10px] text-muted-foreground">
                                            Timezone: {field.value.timezone}
                                        </p>
                                    </div>
                                )}

                                {formState.errors.location && (
                                    <p className={errorClass}>
                                        {formState.errors.location.message ||
                                            'Please select a valid location.'}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                </div>
            </section>
        </form>
    );
}
