import { Building2 } from 'lucide-react';

import type { OrganizationResponse } from '../../../../../../../models/organization.model.ts';
import { ActivationStatusRender } from '../../../../../components/ActivationStatusRender.tsx';

interface OrganizationProfileHeaderProps {
    organization: OrganizationResponse;
}

export function OrganizationProfileHeader({ organization }: OrganizationProfileHeaderProps) {
    return (
        <section className="rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 shadow-sm sm:p-6">
            <div className="flex min-w-0 items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="flex size-20 shrink-0 items-center justify-center rounded-full border border-[#d3d3df] bg-[#e7e8ef] text-[#777789] shadow-sm sm:size-24">
                        <Building2 className="size-10 sm:size-12" strokeWidth={1.5} />
                    </div>

                    <div className="min-w-0 text-left">
                        <h2
                            className="truncate text-[18px] font-semibold tracking-tight text-[#343447]"
                            title={organization.name}
                        >
                            {organization.name}
                        </h2>

                        <p className="mt-1 truncate text-[11px] text-[#777789]">
                            {organization.email}
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <ActivationStatusRender status={organization.status} />
                </div>
            </div>

            <div className="mt-5 border-t border-[#d3d3df] pt-4 text-left">
                <p className="text-[10px] tracking-wide text-[#9999aa] uppercase">
                    Organization since
                </p>

                <p className="mt-1 text-[11px] font-medium text-[#454556]">
                    {formatDate(organization.createdAtUTC)}
                </p>
            </div>
        </section>
    );
}

function formatDate(value: Date | string) {
    return new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
