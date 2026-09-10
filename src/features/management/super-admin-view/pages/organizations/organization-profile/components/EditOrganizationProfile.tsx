import { ArrowLeft, CalendarDays, Check, ShieldCheck } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

import type {
    OrganizationResponse,
    UpdateOrganizationByAdminForm,
} from '../../../../../../../models/organization.model.ts';

import { Button } from '../../../../../../../components/Button.tsx';
import { Select } from '../../../../../../../components/Select.tsx';

import { Toast } from '../../../../../../../utlis/toast.ts';

import { ActivationStatus } from '../../../../../../../models/enums/activation-status.ts';

import { useUpdateOrganization } from '../../../../../hooks/orgsnization-hook.ts';

import { OrganizationProfileHeader } from './OrganizationProfileHeader.tsx';
import { OrganizationAboutCard } from './OrganizationAboutCard.tsx';
import { OrganizationLocationCard } from './OrganizationLocationCard.tsx';

import { updateOrganizationByAdminSchema } from '../../../../../../../zod-schemas/organization.schema.ts';

interface EditOrganizationProfileProps {
    organization: OrganizationResponse;
}

const loading = 'Updating organization...';
const success = 'Organization updated successfully';
const error = 'Failed to update organization';

export function EditOrganizationProfile({ organization }: EditOrganizationProfileProps) {
    const navigate = useNavigate();
    const updateOrganizationMutation = useUpdateOrganization();

    const defaultValues: UpdateOrganizationByAdminForm = {
        status: organization.status,
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { isSubmitting, isDirty },
    } = useForm<UpdateOrganizationByAdminForm>({
        resolver: zodResolver(updateOrganizationByAdminSchema),
        defaultValues,
    });

    const status = watch('status');

    const handleSubmitForm = async () => {
        const changedValues: Partial<UpdateOrganizationByAdminForm> = {};

        if (status !== defaultValues.status) {
            changedValues.status = status;
        }

        if (Object.keys(changedValues).length === 0) {
            navigate(`/admin/organizations/${organization.uuid}`);
            return;
        }

        try {
            await toast.promise(
                updateOrganizationMutation.mutateAsync({
                    uuid: organization.uuid,
                    ...changedValues,
                }),
                new Toast(loading, success, error),
            );

            navigate(`/admin/organizations/${organization.uuid}`);
        } catch {}
    };

    return (
        <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="flex min-w-0 flex-1 flex-col gap-4"
        >
            <div className="flex min-w-0 items-center justify-between gap-3">
                <Button
                    type="button"
                    onClick={() => navigate(`/admin/organizations/${organization.uuid}`)}
                    disabled={isSubmitting}
                    className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 border border-[#d3d3df] bg-transparent px-3 text-[11px] font-semibold text-[#454556] hover:bg-[#ededf2] hover:text-[#343447]"
                >
                    <ArrowLeft className="size-3.5 transition-colors group-hover:text-[#343447]" />
                    Close
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 px-3 text-[11px] font-semibold"
                >
                    <Check className="size-3.5 transition-colors" />
                    Save
                </Button>
            </div>

            <OrganizationProfileHeader organization={organization} />

            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                <OrganizationAboutCard organization={organization} />

                <OrganizationLocationCard location={organization.location} />
            </div>

            <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
                <div className="min-w-0">
                    <h3 className="text-[13px] font-semibold text-[#343447]">
                        Account Information
                    </h3>

                    <p className="mt-0.5 text-[10px] leading-4 text-[#777789]">
                        Administrative information associated with this organization.
                    </p>
                </div>

                <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#ededf2] text-[#777789]">
                            <ShieldCheck className="size-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-medium tracking-wide text-[#9999aa] uppercase">
                                Status
                            </p>

                            <Select
                                id="status"
                                hasError={false}
                                {...register('status')}
                                className="mt-1 h-8 w-full px-2.5 text-[11px]"
                            >
                                {Object.values(ActivationStatus).map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>

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
    value: string;
}) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#ededf2] text-[#777789]">
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-[9px] font-medium tracking-wide text-[#9999aa] uppercase">
                    {label}
                </p>

                <p className="mt-0.5 truncate text-[11px] font-medium text-[#454556]" title={value}>
                    {value}
                </p>
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
