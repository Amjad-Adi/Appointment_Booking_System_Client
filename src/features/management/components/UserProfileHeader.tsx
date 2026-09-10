import { UserCircle } from 'lucide-react';

import type { UserResponse } from '../../../models/user.model.ts';
import { ActivationStatusRender } from './ActivationStatusRender.tsx';
import { Image } from '../../../components/Image.tsx';

interface UserProfileHeaderProps {
    user: UserResponse;
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
    const fullName = `${user.firstName} ${user.lastName}`.trim();

    return (
        <section className="rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 shadow-sm sm:p-6">
            <div className="flex min-w-0 items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                    <ProfilePicture
                        profilePicturePath={user.profilePicturePath}
                        fullName={fullName}
                    />

                    <div className="min-w-0 text-left">
                        <h2 className="truncate text-[18px] font-semibold tracking-tight text-[#343447]">
                            {fullName}
                        </h2>

                        <p className="mt-1 truncate text-[11px] text-[#777789]">{user.email}</p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <RoleBadge role={user.role} />
                    <ActivationStatusRender status={user.status} />
                </div>
            </div>

            <div className="mt-5 border-t border-[#d3d3df] pt-4 text-left">
                <p className="text-[10px] tracking-wide text-[#9999aa] uppercase">Member since</p>

                <p className="mt-1 text-[11px] font-medium text-[#454556]">
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
    profilePicturePath: string;
    fullName: string;
}) {
    if (profilePicturePath != 'DEFAULT_PICTURE_PATH') {
        return (
            <Image
                src={profilePicturePath}
                alt={`${fullName} profile`}
                className="size-20 shrink-0 rounded-full border border-[#d3d3df] bg-[#e7e8ef] object-cover shadow-sm sm:size-24"
            />
        );
    }

    return (
        <div className="flex size-20 shrink-0 items-center justify-center rounded-full border border-[#d3d3df] bg-[#e7e8ef] text-[#777789] shadow-sm sm:size-24">
            <UserCircle className="size-18 sm:size-20" strokeWidth={1.5} />
        </div>
    );
}

function RoleBadge({ role }: { role: string }) {
    return (
        <span className="inline-flex h-6 shrink-0 items-center rounded-md border border-[#cfd4e2] bg-[#eef1f7] px-2 text-[9px] font-semibold tracking-wide text-[#4b556d] uppercase">
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
