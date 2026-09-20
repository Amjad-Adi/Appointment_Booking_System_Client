import { CalendarDays, ShieldCheck, UserRound } from 'lucide-react';

import type { UserResponse } from '../../../../../../../models/user.model.ts';
import { ActivationStatusRender } from '../../../../../components/ActivationStatusRender.tsx';

interface UserAccountCardProps {
    user: UserResponse;
}

export function UserAccountCard({ user }: UserAccountCardProps) {
    return (
        <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
            <div className="min-w-0">
                <h3 className="text-[13px] font-semibold text-[#343447]">Account Information</h3>

                <p className="mt-0.5 text-[10px] leading-4 text-[#777789]">
                    Administrative information associated with this account.
                </p>
            </div>

            <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
                <AccountItem
                    icon={<UserRound className="size-4" />}
                    label="Role"
                    value={user.role}
                />

                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#ededf2] text-[#777789]">
                        <ShieldCheck className="size-4" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-[9px] font-medium tracking-wide text-[#9999aa] uppercase">
                            Status
                        </p>

                        <div className="mt-1">
                            <ActivationStatusRender status={user.status} />
                        </div>
                    </div>
                </div>

                <AccountItem
                    icon={<CalendarDays className="size-4" />}
                    label="Last Updated"
                    value={formatDate(user.updatedAtUTC)}
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
                    {value || '—'}
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
