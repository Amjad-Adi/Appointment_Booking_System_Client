import { useState } from 'react';
import { type PaginationState, type SortingState } from '@tanstack/react-table';
import { DataTable } from '../../../../../../components/DataTable.tsx';
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
import { Select } from '../../../../../../components/Select.tsx';
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
        <div className="flex min-w-0 flex-1 gap-2 max-sm:justify-between sm:gap-[4%]">
            <Select
                value={role ?? ''}
                onChange={(event) => {
                    const value = event.target.value;

                    setRole(value === '' ? undefined : (value as Role));

                    setPagination((previous) => ({
                        ...previous,
                        pageIndex: 0,
                    }));
                }}
                wrapperClassName="w-36 max-sm:w-[48%] max-[350px]:w-full"
                className="!h-8 px-2 text-[11px]"
            >
                <option value="">All roles</option>

                {Object.values(Role).map((role) => (
                    <option key={role} value={role}>
                        {role}
                    </option>
                ))}
            </Select>

            <Select
                value={status ?? ''}
                onChange={(event) => {
                    const value = event.target.value;

                    setStatus(value === '' ? undefined : (value as ActivationStatus));

                    setPagination((previous) => ({
                        ...previous,
                        pageIndex: 0,
                    }));
                }}
                wrapperClassName="w-40 max-sm:w-[48%] max-[350px]:w-full"
                className="!h-8 px-2 text-[11px]"
            >
                <option value="">All statuses</option>

                {Object.values(ActivationStatus).map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </Select>
        </div>
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
