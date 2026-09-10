import { Mail, Languages, CalendarDays } from 'lucide-react';

import type { UserResponse } from '../../../../../../../models/user.model.ts';

interface UserAboutCardProps {
    user: UserResponse;
}

export function UserAboutCard({ user }: UserAboutCardProps) {
    return (
        <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
            <CardHeader title="About" description="Basic information about this user." />

            <div className="mt-5 flex flex-col gap-4">
                <InfoRow icon={<Mail className="size-4" />} label="Email" value={user.email} />

                <InfoRow
                    icon={<Languages className="size-4" />}
                    label="Language"
                    value={user.language}
                />

                <InfoRow
                    icon={<CalendarDays className="size-4" />}
                    label="Created"
                    value={formatDate(user.createdAtUTC)}
                />
            </div>
        </section>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#ededf2] text-[#777789]">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-[9px] font-medium tracking-wide text-[#9999aa] uppercase">
                    {label}
                </p>

                <p className="truncate text-[11px] font-medium text-[#454556]" title={value}>
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

function CardHeader({ title, description }: { title: string; description: string }) {
    return (
        <div>
            <h3 className="text-[13px] font-semibold text-[#343447]">{title}</h3>

            <p className="mt-0.5 text-[10px] leading-4 text-[#777789]">{description}</p>
        </div>
    );
}
