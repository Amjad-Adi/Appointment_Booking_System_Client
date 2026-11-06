import { Building2 } from 'lucide-react';

import type { OrganizationResponse } from '../../../../../../../models/organization.model.ts';
import { EntityImage } from '../../../../../../../components/EntityImage.tsx';
import { ActivationStatusRender } from '../../../../../components/ActivationStatusRender.tsx';

interface OrganizationProfileHeaderProps {
    organization: OrganizationResponse;
}

export function OrganizationProfileHeader({ organization }: OrganizationProfileHeaderProps) {
    return (
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex min-w-0 items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                    <EntityImage
                        src={organization.profilePicturePath}
                        alt={organization.name}
                        icon={Building2}
                        className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-muted-foreground shadow-sm sm:size-24"
                        iconClassName="size-10 sm:size-12"
                        strokeWidth={1.5}
                    />

                    <div className="min-w-0 text-left">
                        <h2
                            className="truncate text-[18px] font-semibold tracking-tight text-foreground"
                            title={organization.name}
                        >
                            {organization.name}
                        </h2>

                        <p className="mt-1 truncate text-[11px] text-muted-foreground">
                            {organization.email}
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <ActivationStatusRender status={organization.status} />
                </div>
            </div>

            <div className="mt-5 border-t border-border pt-4 text-left">
                <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                    Organization since
                </p>

                <p className="mt-1 text-[11px] font-medium text-secondary-foreground">
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
