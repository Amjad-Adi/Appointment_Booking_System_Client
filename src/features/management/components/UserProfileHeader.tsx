import { UserCircle } from 'lucide-react';

import type { UserResponse } from '../../../models/user.model.ts';
import { ActivationStatusRender } from './ActivationStatusRender.tsx';
import { EntityImage } from '../../../components/EntityImage.tsx';

interface UserProfileHeaderProps {
    user: UserResponse;
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
    const fullName = `${user.firstName} ${user.lastName}`.trim();

    return (
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex min-w-0 items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                    <ProfilePicture
                        profilePicturePath={user.profilePicturePath}
                        fullName={fullName}
                    />

                    <div className="min-w-0 text-left">
                        <h2 className="truncate text-[18px] font-semibold tracking-tight text-foreground">
                            {fullName}
                        </h2>

                        <p className="mt-1 truncate text-[11px] text-muted-foreground">{user.email}</p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <RoleBadge role={user.role} />
                    <ActivationStatusRender status={user.status} />
                </div>
            </div>

            <div className="mt-5 border-t border-border pt-4 text-left">
                <p className="text-[10px] tracking-wide text-muted-foreground uppercase">Member since</p>

                <p className="mt-1 text-[11px] font-medium text-secondary-foreground">
                    {formatDate(user.createdAtUTC)}
                </p>
            </div>
        </section>
    );
}

function ProfilePicture({
    profilePicturePath,
    fullName,
}: {
    profilePicturePath?: string | null;
    fullName: string;
}) {
    return (
        <EntityImage
            src={profilePicturePath}
            alt={`${fullName} profile`}
            icon={UserCircle}
            className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-muted-foreground shadow-sm sm:size-24"
            iconClassName="size-10 sm:size-12"
            strokeWidth={1.5}
        />
    );
}

function RoleBadge({ role }: { role: string }) {
    return (
        <span className="inline-flex h-6 shrink-0 items-center rounded-md border border-border-strong bg-muted px-2 text-[9px] font-semibold tracking-wide text-secondary-foreground uppercase">
            {role}
        </span>
    );
}

function formatDate(value: Date | string) {
    return new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
