import { useState } from 'react';
import { type PaginationState, type SortingState } from '@tanstack/react-table';
import { Plus } from 'lucide-react';

import { DataTable } from '../../../../../../../components/DataTable.tsx';
import {
    type DataTableColumn,
    PAGE_SIZE,
} from '../../../../../../../components/DataTableFeatures.ts';
import { useUsers } from '../../../../../hooks/users-hook.ts';
import type { UserResponse } from '../../../../../../../models/user.model.ts';
import { Order } from '../../../../../../../models/enums/order.ts';
import { Role } from '../../../../../../../models/enums/roles.ts';
import { ActivationStatus } from '../../../../../../../models/enums/activation-status.ts';
import { GENERAL_DEBOUNCE_DELAY, useDebounce } from '../../../../../../../hooks/deounce.ts';
import { EditUserDialog } from '../components/EditUserDialog.tsx';
import { CreateUserDialog } from '../components/CreateUserDiaolg.tsx';
import { useDialog } from '../../../../../../../hooks/open-dialog.ts';
import { getUserColumns } from '../columns/UserColumns.tsx';
import { Select } from '../../../../../../../components/Select.tsx';
import { Button } from '../../../../../../../components/Button.tsx';
import { roleRecord } from '../../../../../../../models/enums-mapping/roles.ts';

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

    const [createUserOpen, setCreateUserOpen] = useState(false);

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
                label="Role"
                isLabelDisabled
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
                        {roleRecord[role]}
                    </option>
                ))}
            </Select>

            <Select
                label="Status"
                isLabelDisabled
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
                sorting={sorting}
                onSortingChange={setSorting}
                pagination={pagination}
                onPaginationChange={setPagination}
                search={search}
                onSearchChange={setSearch}
                filters={filters}
                actions={
                    <Button
                        type="button"
                        onClick={() => setCreateUserOpen(true)}
                        className="flex h-8 min-h-0 w-auto shrink-0 items-center gap-1.5 px-3 text-[11px]"
                    >
                        <Plus className="size-3.5" strokeWidth={2} />
                        Add User
                    </Button>
                }
                rowCount={data?.pagination?.totalItems ?? 0}
                rowCountLabel={`${data?.pagination?.totalItems == 0 ? 'No' : `${data?.pagination.totalItems}`} Users`}
            />
            <CreateUserDialog open={createUserOpen} onOpenChange={setCreateUserOpen} />
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
