import type { UserResponse } from '../../../../../../../models/user.model.ts';
import type { DataTableColumn } from '../../../../../../../components/DataTableFeatures.ts';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../../../../../../components/DropdownMenu.tsx';
import { Button } from '../../../../../../../components/Button.tsx';
import { MoreHorizontalIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ActivationStatus } from '../../../../../../../models/enums/activation-status.ts';
export const USER_TABLE_COLUMN = {
    NAME: 'name',
    EMAIL: 'email',
    ROLE: 'role',
    STATUS: 'status',
    CREATED_AT: 'createdAtUTC',
    ACTIONS: 'actions',
};
export const USER_TABLE_HEADER = {
    NAME: 'Full Name',
    EMAIL: 'Email',
    ROLE: 'Role',
    STATUS: 'Status',
    CREATED_AT: 'Joined At',
    ACTIONS: 'Actions',
};

export function getUserColumns(
    onEdit: (user: UserResponse) => void,
): DataTableColumn<UserResponse>[] {
    return [
        {
            id: USER_TABLE_COLUMN.NAME,
            accessorFn: (user) => `${user.firstName} ${user.lastName}`,
            header: USER_TABLE_HEADER.NAME,
        },
        {
            accessorKey: USER_TABLE_COLUMN.EMAIL,
            header: USER_TABLE_HEADER.EMAIL,
            enableSorting: false,
        },
        {
            accessorKey: USER_TABLE_COLUMN.ROLE,
            header: USER_TABLE_HEADER.ROLE,
            enableSorting: false,
        },
        {
            accessorKey: USER_TABLE_COLUMN.STATUS,
            header: USER_TABLE_HEADER.STATUS,
            enableSorting: false,
            cell: ({ row }) => {
                const isActive = row.original.status === ActivationStatus.ACTIVE;

                return (
                    <div className="flex items-center justify-center">
                        <span className="relative size-2.5">
                            {isActive && (
                                <span className="absolute inset-0 size-2.5 rounded-full bg-emerald-500 opacity-15" />
                            )}

                            <span
                                className={`absolute inset-0 size-2.5 rounded-full ${
                                    isActive ? 'bg-emerald-500' : 'bg-red-400'
                                }`}
                            />
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: USER_TABLE_COLUMN.CREATED_AT,
            header: USER_TABLE_HEADER.CREATED_AT,
            cell: ({ row }) => {
                return new Date(row.original.createdAtUTC).toLocaleDateString();
            },
        },
        {
            id: USER_TABLE_COLUMN.ACTIONS,
            header: USER_TABLE_HEADER.ACTIONS,
            enableSorting: false,
            cell: ({ row }) => <UserActions user={row.original} onEdit={onEdit} />,
        },
    ];
}

function UserActions({
    user,
    onEdit,
}: {
    user: UserResponse;
    onEdit: (user: UserResponse) => void;
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
                            <MoreHorizontalIcon className="size-4 shrink-0" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    }
                />
            </div>
            <DropdownMenuContent className="flex flex-col justify-end p-1">
                <DropdownMenuItem className="h-7 px-2 text-[11px]" onClick={() => onEdit(user)}>
                    Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="h-7 px-2 text-[11px]"
                    onClick={() => navigate(`/users/${user.uuid}`)}
                >
                    View Profile
                </DropdownMenuItem>

                {user.organizationUuid && (
                    <>
                        <DropdownMenuSeparator className="my-1" />
                        <DropdownMenuItem
                            className="h-7 px-2 text-[11px]"
                            onClick={() => navigate(`/organizations/${user.organizationUuid}`)}
                        >
                            View Organization Profile
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
