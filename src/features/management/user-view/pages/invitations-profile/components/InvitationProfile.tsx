import { CalendarClock, Clock3, Mail, Pencil, Send, UserRound } from 'lucide-react';

import { useNavigate } from 'react-router';

import type { InvitationResponse } from '../../../../../../models/invitation.model.ts';

import { BackButton } from '../../../../components/BackButton.tsx';
import { Button } from '../../../../../../components/Button.tsx';

interface InvitationProfileProps {
    invitation?: InvitationResponse;
    isLoading: boolean;
    isError: boolean;
    canEdit: boolean;
}

function formatDate(value: Date | string) {
    return new Date(value).toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

function getStatusClass(status: InvitationResponse['invitationStatus']) {
    const value = String(status);

    if (value === 'PENDING' || value === 'ACCEPTED') {
        return 'bg-green-500';
    }

    if (value === 'REJECTED' || value === 'EXPIRED' || value === 'CANCELLED') {
        return 'bg-red-500';
    }

    return 'bg-gray-400';
}

export function InvitationProfile({
    invitation,
    isLoading,
    isError,
    canEdit,
}: InvitationProfileProps) {
    const navigate = useNavigate();

    if (isLoading) {
        return <div className="p-6 text-sm text-[#777789]">Loading invitation...</div>;
    }

    if (isError || !invitation) {
        return <div className="p-6 text-sm text-[#c94a5c]">Failed to load invitation.</div>;
    }

    const recipientName = `${invitation.recipientFirstName} ${invitation.recipientLastName}`.trim();

    const senderName = `${invitation.senderFirstName} ${invitation.senderLastName}`.trim();

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
                <BackButton backPath={'/organization/invitations'} />

                {canEdit && (
                    <Button
                        type="button"
                        className="h-8 text-[11px]"
                        onClick={() =>
                            navigate(`/organization/invitations/${invitation.uuid}/edit`)
                        }
                    >
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                    </Button>
                )}
            </div>

            <div className="overflow-hidden rounded-xl border border-[#d3d3df] bg-white">
                <div className="bg-[#dedee8] px-6 py-6">
                    <div className="flex items-center gap-4">
                        {invitation.recipientProfilePicturePath ? (
                            <img
                                src={invitation.recipientProfilePicturePath}
                                alt={recipientName}
                                className="h-16 w-16 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                                <UserRound className="h-7 w-7 text-[#777789]" />
                            </div>
                        )}

                        <div className="min-w-0">
                            <h1 className="text-lg font-semibold text-[#343447]">
                                {recipientName || 'Invitation'}
                            </h1>

                            <p className="mt-1 text-xs text-[#777789]">
                                {invitation.recipientEmail}
                            </p>

                            <div className="mt-2 flex items-center gap-2">
                                <span
                                    className={[
                                        'h-2 w-2 rounded-full',
                                        getStatusClass(invitation.invitationStatus),
                                        'animate-pulse',
                                    ].join(' ')}
                                />

                                <span className="text-[11px] font-medium text-[#343447]">
                                    {invitation.invitationStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2">
                    <div className="rounded-lg border border-[#d3d3df] p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <Send className="h-4 w-4 text-[#777789]" />

                            <h2 className="text-xs font-semibold text-[#343447]">Sender</h2>
                        </div>

                        <p className="text-sm font-medium text-[#343447]">{senderName}</p>

                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#777789]">
                            <Mail className="h-3.5 w-3.5" />
                            {invitation.senderEmail}
                        </div>
                    </div>

                    <div className="rounded-lg border border-[#d3d3df] p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <UserRound className="h-4 w-4 text-[#777789]" />

                            <h2 className="text-xs font-semibold text-[#343447]">Recipient</h2>
                        </div>

                        <p className="text-sm font-medium text-[#343447]">{recipientName}</p>

                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#777789]">
                            <Mail className="h-3.5 w-3.5" />
                            {invitation.recipientEmail}
                        </div>
                    </div>

                    <div className="rounded-lg border border-[#d3d3df] p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <CalendarClock className="h-4 w-4 text-[#777789]" />

                            <h2 className="text-xs font-semibold text-[#343447]">Created</h2>
                        </div>

                        <p className="text-sm text-[#343447]">
                            {formatDate(invitation.createdAtUTC)}
                        </p>
                    </div>

                    <div className="rounded-lg border border-[#d3d3df] p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <Clock3 className="h-4 w-4 text-[#777789]" />

                            <h2 className="text-xs font-semibold text-[#343447]">Expires</h2>
                        </div>

                        <p className="text-sm text-[#343447]">
                            {formatDate(invitation.expiresAtUTC)}
                        </p>
                    </div>
                </div>

                <div className="border-t border-[#d3d3df] px-6 py-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-medium tracking-wide text-[#777789] uppercase">
                            Organization
                        </span>

                        <span className="text-sm font-medium text-[#343447]">
                            {invitation.organizationName}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
