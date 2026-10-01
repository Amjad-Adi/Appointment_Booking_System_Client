import { useNavigate } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Building2, Check, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import type { z } from 'zod';

import { TextField } from '../../../../../../../../components/TextField.tsx';
import { Button } from '../../../../../../../../components/Button.tsx';
import { LocationPicker } from '../../../organization-profile/components/LocationPicker.tsx';

import { createOrganizationByAdminSchema } from '../../../../../../../../zod-schemas/organization.schema.ts';
import { useCreateOrganization } from '../../../../../../hooks/organization-hook.ts';

import type { CreateOrganizationByAdmin } from '../../../../../../../../models/organization.model.ts';

type FormValues = z.infer<typeof createOrganizationByAdminSchema>;

export function CreateOrganizationForm() {
    const navigate = useNavigate();
    const createMutation = useCreateOrganization();

    const [locationSelected, setLocationSelected] = useState(false);

    const { register, control, handleSubmit, formState, setError } = useForm<FormValues>({
        resolver: zodResolver(createOrganizationByAdminSchema),
        defaultValues: {
            name: '',
            email: '',
            phoneNumber: '',
            userEmail: '',
            bio: '',
            location: {
                name: '',
                locationOnMap: [35.2034, 31.9038],
                timezone: 'Asia/Hebron',
            },
        },
    });

    async function submitOrganization(values: FormValues) {
        if (!locationSelected) {
            setError('location', {
                type: 'manual',
                message: 'Please select your business location.',
            });
            return;
        }

        const payload: CreateOrganizationByAdmin = {
            ...values,
            bio: values.bio?.trim() || undefined,
        };

        try {
            await toast.promise(createMutation.mutateAsync(payload), {
                loading: 'Creating organization...',
                success: 'Organization created successfully!',
                error: 'Failed to create organization.',
            });

            navigate('/organization', { replace: true });
        } catch {
            // Error is already displayed by toast.
        }
    }

    const errorClass = 'mt-1 text-[10px] text-[#c94a5c]';

    return (
        <form onSubmit={handleSubmit(submitOrganization)} className="flex min-w-0 flex-col gap-4">
            {/* Actions */}
            <div className="flex min-w-0 items-center justify-end gap-2">
                <Button
                    type="button"
                    onClick={() => navigate(-1)}
                    disabled={createMutation.isPending}
                    className="h-8 w-auto shrink-0 border border-[#d3d3df] bg-transparent px-3 text-[11px] font-semibold text-[#454556] hover:bg-[#ededf2] hover:text-[#343447]"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 px-3 text-[11px] font-semibold"
                >
                    <Check className="size-3.5" strokeWidth={2} />

                    {createMutation.isPending ? 'Creating...' : 'Create Organization'}
                </Button>
            </div>

            {/* Business Information */}
            <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#ededf2] text-[#777789]">
                        <Building2 className="size-4" strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-[13px] font-semibold text-[#343447]">
                            Business Information
                        </h3>

                        <p className="mt-0.5 text-[10px] leading-4 text-[#777789]">
                            Enter your organization's basic details.
                        </p>
                    </div>
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

                    <TextField
                        label="Owner Email"
                        id="organization_owner_email"
                        type="email"
                        placeholder="Owner email"
                        errorMessage={formState.errors.userEmail?.message}
                        {...register('userEmail')}
                    />

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
                            className="text-[11px] font-medium text-[#343447]"
                        >
                            Description
                            <span className="ml-1 font-normal text-[#777789]">(Optional)</span>
                        </label>

                        <textarea
                            id="organization_bio"
                            rows={3}
                            maxLength={4096}
                            placeholder="Describe your organization..."
                            className="mt-1.5 w-full resize-y rounded-lg border border-[#d3d3df] bg-white p-2.5 text-[11px] text-[#343447] transition-colors outline-none placeholder:text-[#777789] focus:border-[#454556]"
                            {...register('bio')}
                        />

                        {formState.errors.bio && (
                            <p className={errorClass}>{formState.errors.bio.message}</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Business Location */}
            <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#ededf2] text-[#777789]">
                        <MapPin className="size-4" strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-[13px] font-semibold text-[#343447]">
                            Business Location
                        </h3>

                        <p className="mt-0.5 text-[10px] leading-4 text-[#777789]">
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
                                    <div className="rounded-lg bg-white p-3">
                                        <p className="text-[11px] font-medium text-[#343447]">
                                            Selected Location
                                        </p>

                                        <p className="mt-1 text-[10px] break-words text-[#777789]">
                                            {field.value.name || 'Unnamed location'}
                                        </p>

                                        <p className="mt-1 text-[10px] text-[#777789]">
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
