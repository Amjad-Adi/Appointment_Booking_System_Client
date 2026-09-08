import { useState } from 'react';
import { type PaginationState, type SortingState } from '@tanstack/react-table';
import { DataTable } from '../../../../../../components/Table.tsx';
import { type DataTableColumn, PAGE_SIZE } from '../../../../../../components/DataTableFeatures.ts';
import { useUsers } from '../../../../hooks/users-hook.ts';
import type { UserResponse } from '../../../../../../models/user.model.ts';
import { Order } from '../../../../../../models/enums/order.ts';
import { Role } from '../../../../../../models/enums/roles.ts';
import { ActivationStatus } from '../../../../../../models/enums/activation-status.ts';
import { GENERAL_DEBOUNCE_DELAY, useDebounce } from '../../../../../../hooks/deounce.ts';
import { EditUserDialog } from '../EditUserDialog.tsx';
import { useDialog } from '../../../../../../hooks/open-dialog.ts';
import { getUserColumns } from './columns/UserColumns.tsx';

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
    const userDialog = useDialog<UserResponse>();
    const columns = getUserColumns(userDialog.open);
    const sort = sorting[0];
    const sortBy: 'name' | 'createdAtUTC' | undefined = sort
        ? sort.id === 'createdAtUTC'
            ? 'createdAtUTC'
            : 'name'
        : undefined;
    const order = sort ? (sort.desc ? Order.DESC : Order.ASC) : undefined;
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
        return <div>Loading users...</div>; //Needs Improvement
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
                rowCountLabel={`${data?.pagination?.totalItems ?? 'No'} Users`}
            />

            {userDialog.selectedItem && (
                <EditUserDialog
                    user={userDialog.selectedItem}
                    open={userDialog.isOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            userDialog.close();
                        }
                    }}
                />
            )}
        </>
    );
}
