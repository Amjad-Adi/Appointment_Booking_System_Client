import { MoreHorizontalIcon, Mail } from 'lucide-react';

import type { InvitationResponse } from '../../../../../../../models/invitation.model.ts';
import type { DataTableColumn } from '../../../../../../../components/DataTableFeatures.ts';
import { InvitationStatus } from '../../../../../../../models/enums/invitation-status.ts';
import { invitationStatusRecord } from '../../../../../../../models/enums-mapping/invitation-status.ts';
import { roleRecord } from '../../../../../../../models/enums-mapping/roles.ts';
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
    canUpdate = true,
): DataTableColumn<InvitationResponse>[] {
    const columns: DataTableColumn<InvitationResponse>[] = [
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
                    <Mail className="size-4 text-muted-foreground" />
                    <span className="truncate">{row.original.recipientEmail}</span>
                </div>
            ),
        },
        {
            accessorKey: 'role',
            header: INVITATION_TABLE_HEADER.ROLE,
            enableSorting: false,
            cell: ({ row }) => (
                <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-foreground">
                    {roleRecord[row.original.role]}
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
                    <span className={isExpired ? 'text-destructive' : ''}>
                        {new Date(row.original.expiresAtUTC).toLocaleDateString()}
                    </span>
                );
            },
        },
    ];

    if (canUpdate) {
        columns.push({
            id: 'actions',
            header: INVITATION_TABLE_HEADER.ACTIONS,
            enableSorting: false,
            cell: ({ row }) => <InvitationActions invitation={row.original} onEdit={onEdit} />,
        });
    }

    return columns;
}

function InvitationStatusRender({ status }: { status: InvitationStatus }) {
    const colorByStatus: Record<InvitationStatus, string> = {
        [InvitationStatus.PENDING]: 'bg-warning',
        [InvitationStatus.ACCEPTED]: 'bg-success',
        [InvitationStatus.EXPIRED]: 'bg-destructive',
        [InvitationStatus.CANCELLED]: 'bg-muted-foreground',
    };

    return (
        <div className="flex items-center gap-1.5">
            <span className={`size-2 shrink-0 rounded-full ${colorByStatus[status]}`} />
            <span className="text-[11px] font-medium text-foreground">
                {invitationStatusRecord[status]}
            </span>
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
                            className="size-6 min-h-0 min-w-0 !border-transparent !bg-transparent p-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 hover:!bg-transparent disabled:opacity-50 sm:h-6 sm:w-6 sm:px-0 md:h-6 md:w-6"
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
