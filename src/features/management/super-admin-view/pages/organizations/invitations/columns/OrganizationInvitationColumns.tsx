import { MoreHorizontalIcon, Mail } from 'lucide-react';

import type { InvitationResponse } from '../../../../../../../models/invitation.model.ts';
import type { DataTableColumn } from '../../../../../../../components/DataTableFeatures.ts';
import { InvitationStatus } from '../../../../../../../models/enums/invitation-status.ts';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../../../../../../components/DropdownMenu.tsx';
import { Button } from '../../../../../../../components/Button.tsx';

export const INVITATION_TABLE_HEADER = {
    EMAIL: 'Invited Email',
    ROLE: 'Role',
    STATUS: 'Status',
    SENDER: 'Sent By',
    CREATED_AT: 'Created At',
    EXPIRES_AT: 'Expires',
    ACTIONS: 'Actions',
} as const;

export function getOrganizationInvitationColumns(
    onEdit: (invitation: InvitationResponse) => void,
): DataTableColumn<InvitationResponse>[] {
    return [
        {
            accessorKey: 'status',
            header: INVITATION_TABLE_HEADER.STATUS,
            enableSorting: false,
            cell: ({ row }) => <InvitationStatusRender status={row.original.status} />,
        },
        {
            accessorKey: 'recipientEmail',
            header: INVITATION_TABLE_HEADER.EMAIL,
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Mail className="size-4 text-slate-400" />
                    <span className="truncate">{row.original.recipientEmail}</span>
                </div>
            ),
        },
        {
            accessorKey: 'role',
            header: INVITATION_TABLE_HEADER.ROLE,
            enableSorting: false,
            cell: ({ row }) => (
                <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-700">
                    {row.original.role}
                </span>
            ),
        },
        {
            accessorKey: 'createdAtUTC',
            header: INVITATION_TABLE_HEADER.CREATED_AT,
            cell: ({ row }) => new Date(row.original.createdAtUTC).toLocaleDateString(),
        },
        {
            accessorKey: 'expiresAtUTC',
            header: INVITATION_TABLE_HEADER.EXPIRES_AT,
            cell: ({ row }) => {
                const isExpired = new Date(row.original.expiresAtUTC) < new Date();
                return (
                    <span className={isExpired ? 'text-[#c94a5c]' : ''}>
                        {new Date(row.original.expiresAtUTC).toLocaleDateString()}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: INVITATION_TABLE_HEADER.ACTIONS,
            enableSorting: false,
            cell: ({ row }) => <InvitationActions invitation={row.original} onEdit={onEdit} />,
        },
    ];
}

function InvitationStatusRender({ status }: { status: InvitationStatus }) {
    const config = {
        [InvitationStatus.PENDING]: { color: 'bg-yellow-500', label: 'Pending' },
        [InvitationStatus.ACCEPTED]: { color: 'bg-green-500', label: 'Accepted' },
        [InvitationStatus.EXPIRED]: { color: 'bg-red-500', label: 'Expired' },
        [InvitationStatus.CANCELLED]: { color: 'bg-slate-400', label: 'Cancelled' },
    };

    const style = config[status] || config[InvitationStatus.PENDING];

    return (
        <div className="flex items-center gap-1.5">
            <span className={`size-2 shrink-0 rounded-full ${style.color}`} />
            <span className="text-[11px] font-medium text-[#343447]">{style.label}</span>
        </div>
    );
}

function InvitationActions({
    invitation,
    onEdit,
}: {
    invitation: InvitationResponse;
    onEdit: (invitation: InvitationResponse) => void;
}) {
    const canEdit = invitation.status !== InvitationStatus.ACCEPTED;

    return (
        <DropdownMenu>
            <div className="group">
                <DropdownMenuTrigger
                    render={
                        <Button
                            type="button"
                            disabled={!canEdit}
                            className="size-6 min-h-0 min-w-0 !border-transparent !bg-transparent p-0 text-slate-600 transition-transform duration-200 group-hover:-translate-y-0.5 hover:!bg-transparent disabled:opacity-50 sm:h-6 sm:w-6 sm:px-0 md:h-6 md:w-6"
                        >
                            <MoreHorizontalIcon className="size-4 shrink-0" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    }
                />
            </div>

            {canEdit && (
                <DropdownMenuContent className="flex flex-col justify-end p-1">
                    <DropdownMenuItem
                        className="h-7 px-2 text-[11px]"
                        onClick={() => onEdit(invitation)}
                    >
                        Edit Invitation
                    </DropdownMenuItem>
                </DropdownMenuContent>
            )}
        </DropdownMenu>
    );
}