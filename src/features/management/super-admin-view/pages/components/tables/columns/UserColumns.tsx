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
    CREATED_AT: 'Created At',
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
        },
        {
            accessorKey: USER_TABLE_COLUMN.CREATED_AT,
            header: USER_TABLE_HEADER.CREATED_AT,
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
                            className="bg-secondary hover:bg-secondary/90 size-8 p-0 text-white transition-transform duration-200 group-hover:-translate-y-0.5"
                        >
                            <MoreHorizontalIcon className="size-5 shrink-0" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    }
                />
            </div>
            <DropdownMenuContent className="flex flex-col justify-end">
                <DropdownMenuItem onClick={() => onEdit(user)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/users/${user.uuid}`)}>
                    View Profile
                </DropdownMenuItem>
                {user.organizationUuid && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
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
