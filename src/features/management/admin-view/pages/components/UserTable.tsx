import { useState } from 'react';
import { type PaginationState, type SortingState } from '@tanstack/react-table';
import { DataTable } from '../../../../../components/Table.tsx';
import { type DataTableColumn, PAGE_SIZE } from '../../../../../components/ui/DataTableFeatures.ts';
import { useUsers } from '../../../hooks/users/users-hook.ts';
import type { UserResponse } from '../../../../../models/user.model.ts';
import { Order } from '../../../../../models/enums/order.ts';
import { Role } from '../../../../../models/enums/roles.ts';
import { ActivationStatus } from '../../../../../models/enums/activation-status.ts';
import { GENERAL_DEBOUNCE_DELAY, useDebounce } from '../../../../../hooks/general-hooks.ts';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../../../../components/DropdownMenu.tsx';
import { Button } from '@base-ui/react';
import { MoreHorizontalIcon } from 'lucide-react';
import { EditUserDialog } from './EditUserDialog.tsx';

export function UsersTable() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });
    const [search, setSearch] = useState('');
    const debounceSearch = useDebounce(search, GENERAL_DEBOUNCE_DELAY);
    const [role, setRole] = useState<Role | undefined>();
    const [status, setStatus] = useState<ActivationStatus | undefined>();
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const sort = sorting[0];
    const sortBy: 'name' | 'createdAtUTC' = sort?.id === 'createdAtUTC' ? 'createdAtUTC' : 'name';
    const order = sort?.desc ? Order.DESC : Order.ASC;
    const { data, isError, isLoading } = useUsers({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy,
        order,
        search: debounceSearch || undefined,
        filter: {
            ...(role && { role }),
            ...(status && { status }),
        },
    });
    const columns: DataTableColumn<UserResponse>[] = [
        {
            accessorKey: 'name',
            accessorFn: (row) => `${row.firstName} ${row.lastName}`,
            header: 'Full Name',
        },
        {
            accessorKey: 'email',
            header: 'Email',
            enableSorting: false,
        },
        {
            accessorKey: 'role',
            header: 'Role',
            enableSorting: false,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            enableSorting: false,
        },
        {
            accessorKey: 'createdAtUTC',
            header: 'Created At',
        },
        {
            id: 'actions',
            header: 'Actions',
            enableSorting: false,

            cell: ({ row }) => {
                const user = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button className="bg-secondary hover:bg-secondary/90 size-8 text-white">
                                    <MoreHorizontalIcon />

                                    <span className="sr-only">Open menu</span>
                                </Button>
                            }
                        />

                        <DropdownMenuContent className="flex flex-col justify-end">
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedUser(user);
                                    setIsEditOpen(true);
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const filters = (
        <>
            <select
                value={role ?? ''}
                onChange={(event) => {
                    const value = event.target.value;

                    setRole(value === '' ? undefined : (value as Role));

                    setPagination((previous) => ({
                        ...previous,
                        pageIndex: 0,
                    }));
                }}
                className="h-10 rounded-md border px-3 text-sm"
            >
                <option value="">All roles</option>

                {Object.values(Role).map((value) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </select>

            <select
                value={status ?? ''}
                onChange={(event) => {
                    const value = event.target.value;

                    setStatus(value === '' ? undefined : (value as ActivationStatus));

                    setPagination((previous) => ({
                        ...previous,
                        pageIndex: 0,
                    }));
                }}
                className="h-10 rounded-md border px-3 text-sm"
            >
                <option value="">All statuses</option>

                {Object.values(ActivationStatus).map((value) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </select>
        </>
    );

    if (isLoading) {
        return <div>Loading users...</div>;
    }

    if (isError) {
        return <div>Failed to load users.</div>;
    }

    return (
        <>
            <DataTable
                tableKey="users-table"
                data={data?.data ?? []}
                columns={columns}
                caption="System Users"
                sorting={sorting}
                onSortingChange={setSorting}
                pagination={pagination}
                onPaginationChange={setPagination}
                search={search}
                onSearchChange={setSearch}
                filters={filters}
                rowCount={data?.pagination?.totalItems ?? 0}
            />

            {selectedUser && (
                <EditUserDialog
                    user={selectedUser}
                    open={isEditOpen}
                    onOpenChange={(open) => {
                        setIsEditOpen(open);
                        if (!open) {
                            setSelectedUser(null);
                        }
                    }}
                />
            )}
        </>
    );
}
