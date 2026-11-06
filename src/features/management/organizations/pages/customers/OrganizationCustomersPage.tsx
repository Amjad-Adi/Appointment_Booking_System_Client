import { useState } from 'react';
import { type PaginationState, type SortingState } from '@tanstack/react-table';
import { UserRound } from 'lucide-react';

import { ManagementPage } from '../../../components/ManagementPage.tsx';
import { DataTable } from '../../../../../components/DataTable.tsx';
import { EntityImage } from '../../../../../components/EntityImage.tsx';
import { ActivationStatusRender } from '../../../components/ActivationStatusRender.tsx';
import { ErrorState } from '../../../../../components/ErrorState.tsx';
import { PAGE_SIZE, type DataTableColumn } from '../../../../../components/DataTableFeatures.ts';

import { useCurrentUser, useOrganizationCustomers } from '../../../hooks/users-hook.ts';

import { Order } from '../../../../../models/enums/order.ts';
import type { OrganizationCustomer } from '../../../../../models/user.model.ts';

export function OrganizationCustomersPage() {
    const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
    const organizationUuid = currentUser?.organizationUuid;

    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });
    const [search, setSearch] = useState('');

    const sort = sorting[0];
    const sortBy: 'name' | 'createdAtUTC' | undefined = sort
        ? sort.id === 'createdAtUTC'
            ? 'createdAtUTC'
            : 'name'
        : undefined;

    const { data, isLoading, isError, error, refetch } = useOrganizationCustomers(
        organizationUuid,
        {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            sortBy,
            order: sort ? (sort.desc ? Order.DESC : Order.ASC) : undefined,
            search: search || undefined,
        },
        !isUserLoading,
    );

    const columns: DataTableColumn<OrganizationCustomer>[] = [
        {
            accessorKey: 'firstName',
            header: 'Customer',
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex min-w-0 items-center gap-2">
                    <EntityImage
                        src={row.original.profilePicturePath}
                        alt={`${row.original.firstName} ${row.original.lastName}`}
                        icon={UserRound}
                        className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-muted-foreground"
                        iconClassName="size-4"
                    />

                    <div className="min-w-0">
                        <p
                            className="max-w-52 truncate font-medium text-foreground"
                            title={`${row.original.firstName} ${row.original.lastName}`}
                        >
                            {row.original.firstName} {row.original.lastName}
                        </p>

                        <p
                            className="max-w-52 truncate text-[9px] text-muted-foreground"
                            title={row.original.email}
                        >
                            {row.original.email}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            id: 'isLinked',
            header: 'Relation',
            enableSorting: false,
            cell: ({ row }) => (
                <span
                    className={[
                        'inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold',
                        row.original.isLinked
                            ? 'border-success-border bg-success-soft text-success'
                            : 'border-border bg-secondary text-secondary-foreground',
                    ].join(' ')}
                >
                    {row.original.isLinked ? 'Linked' : 'New'}
                </span>
            ),
        },
        {
            id: 'appointmentsCount',
            header: 'Appointments',
            enableSorting: false,
            cell: ({ row }) => row.original.appointmentsCount,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            enableSorting: false,
            cell: ({ row }) => <ActivationStatusRender status={row.original.status} />,
        },
        {
            accessorKey: 'createdAtUTC',
            header: 'Joined',
            cell: ({ row }) =>
                new Date(row.original.createdAtUTC).toLocaleDateString(undefined, {
                    dateStyle: 'medium',
                }),
        },
    ];

    if (!isUserLoading && !organizationUuid) {
        return (
            <ManagementPage title="Customers">
                <ErrorState
                    title="No organization linked"
                    message="Your account is not linked to an organization yet."
                />
            </ManagementPage>
        );
    }

    if (isError) {
        return (
            <ManagementPage title="Customers">
                <ErrorState
                    error={error}
                    title="Failed to load customers"
                    onRetry={() => refetch()}
                />
            </ManagementPage>
        );
    }

    return (
        <ManagementPage
            title="Customers"
            description={[
                'Every customer registered in the platform is available here. Linked customers already have a relationship with your organization.',
            ]}
        >
            <DataTable
                tableKey="organization-customers-table"
                data={data?.data ?? []}
                columns={columns}
                sorting={sorting}
                onSortingChange={setSorting}
                pagination={pagination}
                onPaginationChange={setPagination}
                search={search}
                onSearchChange={(value) => {
                    setSearch(value);
                    setPagination((previous) => ({ ...previous, pageIndex: 0 }));
                }}
                rowCount={data?.pagination?.totalItems ?? 0}
                rowCountLabel={`${data?.pagination?.totalItems === 0 ? 'No' : (data?.pagination?.totalItems ?? 0)} Customers`}
                isLoading={isUserLoading || isLoading}
                emptyMessage="No customers match the current filters."
            />
        </ManagementPage>
    );
}
