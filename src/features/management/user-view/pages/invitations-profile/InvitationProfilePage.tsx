import { CalendarClock, Clock3, Mail, Pencil, Send, UserRound } from 'lucide-react';

import type { InvitationResponse } from '../../../../../models/invitation.model.ts';

import { Button } from '../../../../../components/Button.tsx';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../../../../../../@/components/ui/Tooltip.tsx';

interface InvitationCardProps {
    invitation: InvitationResponse;
    canEdit?: boolean;
    onEdit?: (invitation: InvitationResponse) => void;
    onView?: (invitation: InvitationResponse) => void;
}

function formatDate(value: Date | string) {
    return new Date(value).toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

function getStatusClass(status: string) {
    switch (status) {
        case 'PENDING':
        case 'ACCEPTED':
            return 'bg-green-500';

        case 'REJECTED':
        case 'EXPIRED':
        case 'CANCELLED':
            return 'bg-red-500';

        default:
            return 'bg-gray-400';
    }
}

export function InvitationCard({
    invitation,
    canEdit = false,
    onEdit,
    onView,
}: InvitationCardProps) {
    const recipientName = [invitation.recipientFirstName, invitation.recipientLastName]
        .filter(Boolean)
        .join(' ');

    const senderName = [invitation.senderFirstName, invitation.senderLastName]
        .filter(Boolean)
        .join(' ');

    return (
        <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#d3d3df] bg-white shadow-sm">
            <div className="relative flex h-28 items-center justify-center bg-[#dedee8]">
                {invitation.recipientProfilePicturePath ? (
                    <img
                        src={invitation.recipientProfilePicturePath}
                        alt={recipientName}
                        className="h-16 w-16 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f5f8]">
                        <UserRound className="size-8 text-[#777789]" strokeWidth={1.3} />
                    </div>
                )}

                <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-full bg-white px-2 py-1 shadow-sm">
                    <span
                        className={[
                            'size-2 animate-pulse rounded-full',
                            getStatusClass(String(invitation.invitationStatus)),
                        ].join(' ')}
                    />

                    <span className="text-[10px] font-medium text-[#343447]">
                        {invitation.invitationStatus}
                    </span>
                </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3 p-3">
                <div className="flex min-w-0 flex-col">
                    <h3 className="truncate text-sm font-semibold text-[#343447]">
                        {recipientName || 'Unknown User'}
                    </h3>

                    <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] text-[#777789]">
                        <Mail className="size-3.5 shrink-0" />

                        <span className="truncate">{invitation.recipientEmail}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 text-[11px] text-[#777789]">
                    <div className="flex min-w-0 items-center gap-1.5">
                        <Send className="size-3.5 shrink-0" />

                        <span className="truncate">{senderName || 'Unknown Sender'}</span>
                    </div>

                    <div className="flex min-w-0 items-center gap-1.5">
                        <CalendarClock className="size-3.5 shrink-0" />

                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <span className="cursor-default truncate">
                                        Created {formatDate(invitation.createdAtUTC)}
                                    </span>
                                }
                            />

                            <TooltipContent side="top" align="center" className="text-[11px]">
                                {formatDate(invitation.createdAtUTC)}
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="flex min-w-0 items-center gap-1.5">
                        <Clock3 className="size-3.5 shrink-0" />

                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <span className="cursor-default truncate">
                                        Expires {formatDate(invitation.expiresAtUTC)}
                                    </span>
                                }
                            />

                            <TooltipContent side="top" align="center" className="text-[11px]">
                                {formatDate(invitation.expiresAtUTC)}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                <div className="mt-auto flex items-center gap-2">
                    <Button
                        type="button"
                        onClick={() => onView?.(invitation)}
                        className="h-8 flex-1 px-3 text-[11px]"
                    >
                        View Invitation
                    </Button>

                    {canEdit && onEdit ? (
                        <Button
                            type="button"
                            onClick={() => onEdit(invitation)}
                            className="flex h-8 w-8 items-center justify-center p-0"
                            aria-label={`Edit invitation for ${recipientName}`}
                        >
                            <Pencil className="size-3.5" />
                        </Button>
                    ) : null}
                </div>
            </div>
        </article>
    );
}
