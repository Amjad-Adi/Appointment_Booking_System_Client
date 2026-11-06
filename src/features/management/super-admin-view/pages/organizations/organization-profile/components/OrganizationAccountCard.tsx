import { CalendarDays, ShieldCheck } from 'lucide-react';

import type { OrganizationResponse } from '../../../../../../../models/organization.model.ts';
import { ActivationStatusRender } from '../../../../../components/ActivationStatusRender.tsx';

interface OrganizationAccountCardProps {
    organization: OrganizationResponse;
}

export function OrganizationAccountCard({ organization }: OrganizationAccountCardProps) {
    return (
        <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
            <div className="min-w-0">
                <h3 className="text-[13px] font-semibold text-foreground">Account Information</h3>

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
