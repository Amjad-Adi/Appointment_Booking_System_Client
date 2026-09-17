import type { InvitationResponse } from '../../../../../../models/invitation.model.ts';
import type { DataTableColumn } from '../../../../../../components/DataTableFeatures.ts';

import { Button } from '../../../../../../components/Button.tsx';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../../../../../../@/components/ui/dropdown-menu.tsx';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../../../../../../../@/components/ui/Tooltip.tsx';

import { MoreHorizontal, Pencil, UserRound } from 'lucide-react';

import { useNavigate } from 'react-router';

export const INVITATION_TABLE_COLUMN = {
    RECIPIENT: 'recipient',
    ORGANIZATION: 'organizationName',
    SENDER: 'sender',
    STATUS: 'invitationStatus',
    EXPIRES_AT: 'expiresAtUTC',
    CREATED_AT: 'createdAtUTC',
    ACTIONS: 'actions',
} as const;

export const INVITATION_TABLE_HEADER = {
    RECIPIENT: 'Recipient',
    ORGANIZATION: 'Organization',
    SENDER: 'Sent By',
    STATUS: 'Status',
    EXPIRES_AT: 'Expires',
    CREATED_AT: 'Created',
    ACTIONS: 'Actions',
} as const;

function formatDate(value: Date | string) {
    return new Date(value).toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

export function getInvitationColumns(
    onEdit?: (invitation: InvitationResponse) => void,
): DataTableColumn<InvitationResponse>[] {
    return [
        {
            accessorKey: INVITATION_TABLE_COLUMN.RECIPIENT,
            header: INVITATION_TABLE_HEADER.RECIPIENT,
            cell: ({ row }) => <InvitationRecipient invitation={row.original} />,
        },
        {
            accessorKey: INVITATION_TABLE_COLUMN.ORGANIZATION,
            header: INVITATION_TABLE_HEADER.ORGANIZATION,
            cell: ({ row }) => (
                <span className="text-[12px] text-[#343447]">{row.original.organizationName}</span>
            ),
        },
        {
            accessorKey: INVITATION_TABLE_COLUMN.SENDER,
            header: INVITATION_TABLE_HEADER.SENDER,
            cell: ({ row }) => <InvitationSender invitation={row.original} />,
        },
        {
            accessorKey: INVITATION_TABLE_COLUMN.STATUS,
            header: INVITATION_TABLE_HEADER.STATUS,
            cell: ({ row }) => <InvitationStatus status={row.original.invitationStatus} />,
        },
        {
            accessorKey: INVITATION_TABLE_COLUMN.EXPIRES_AT,
            header: INVITATION_TABLE_HEADER.EXPIRES_AT,
            cell: ({ row }) => (
                <span className="text-[12px] text-[#343447]">
                    {formatDate(row.original.expiresAtUTC)}
                </span>
            ),
        },
        {
            accessorKey: INVITATION_TABLE_COLUMN.CREATED_AT,
            header: INVITATION_TABLE_HEADER.CREATED_AT,
            cell: ({ row }) => (
                <Tooltip>
                    <TooltipTrigger>
                        <span className="cursor-default text-[12px] text-[#777789]">
                            {formatDate(row.original.createdAtUTC)}
                        </span>
                    </TooltipTrigger>

                    <TooltipContent>{formatDate(row.original.createdAtUTC)}</TooltipContent>
                </Tooltip>
            ),
        },
        {
            id: INVITATION_TABLE_COLUMN.ACTIONS,
            header: INVITATION_TABLE_HEADER.ACTIONS,
            enableSorting: false,
            cell: ({ row }) => <InvitationActions invitation={row.original} onEdit={onEdit} />,
        },
    ];
}

function InvitationRecipient({ invitation }: { invitation: InvitationResponse }) {
    const fullName = `${invitation.recipientFirstName} ${invitation.recipientLastName}`.trim();

    return (
        <div className="flex min-w-0 items-center gap-2.5">
            {invitation.recipientProfilePicturePath ? (
                <img
                    src={invitation.recipientProfilePicturePath}
                    alt={fullName}
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
            ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ededf2]">
                    <UserRound className="h-4 w-4 text-[#777789]" />
                </div>
            )}

            <div className="min-w-0">
                <p className="truncate text-[12px] font-medium text-[#343447]">
                    {fullName || 'Unknown user'}
                </p>

                <p className="truncate text-[11px] text-[#777789]">{invitation.recipientEmail}</p>
            </div>
        </div>
    );
}

function InvitationSender({ invitation }: { invitation: InvitationResponse }) {
    const fullName = `${invitation.senderFirstName} ${invitation.senderLastName}`.trim();

    return (
        <div className="flex min-w-0 flex-col">
            <span className="truncate text-[12px] text-[#343447]">
                {fullName || 'Unknown user'}
            </span>

            <span className="truncate text-[11px] text-[#777789]">{invitation.senderEmail}</span>
        </div>
    );
}

function InvitationStatus({ status }: { status: InvitationResponse['invitationStatus'] }) {
    const value = String(status);

    const isPositive = value === 'PENDING' || value === 'ACCEPTED';

    const isNegative = value === 'REJECTED' || value === 'EXPIRED' || value === 'CANCELLED';

    return (
        <div className="flex items-center gap-2">
            <span
                className={[
                    'h-2 w-2 rounded-full',
                    isPositive
                        ? 'animate-pulse bg-green-500'
                        : isNegative
                          ? 'animate-pulse bg-red-500'
                          : 'bg-gray-400',
                ].join(' ')}
            />

            <span className="text-[12px]">{value}</span>
        </div>
    );
}

function InvitationActions({
    invitation,
    onEdit,
}: {
    invitation: InvitationResponse;
    onEdit?: (invitation: InvitationResponse) => void;
}) {
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <div className="group">
                <DropdownMenuTrigger
                    render={
                        <Button
                            type="button"
                            className="size-6 min-h-0 min-w-0 !border-transparent !bg-transparent p-0 text-slate-600 transition-transform duration-200 group-hover:-translate-y-0.5 hover:!bg-transparent sm:h-6 sm:w-6 sm:px-0 md:h-6 md:w-6"
                        >
                            <MoreHorizontal className="size-4 shrink-0" />

                            <span className="sr-only">Open menu</span>
                        </Button>
                    }
                />
            </div>

            <DropdownMenuContent className="flex flex-col justify-end p-1">
                <DropdownMenuItem
                    className="h-7 px-2 text-[11px]"
                    onClick={() => navigate(`${invitation.uuid}`)}
                >
                    View Invitation
                </DropdownMenuItem>

                {onEdit && (
                    <DropdownMenuItem
                        className="h-7 px-2 text-[11px]"
                        onClick={() => onEdit(invitation)}
                    >
                        <Pencil className="mr-2 size-3.5" />
                        Edit
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
