import { useState } from 'react';
import { type PaginationState, type SortingState } from '@tanstack/react-table';
import { Plus } from 'lucide-react';

import { DataTable } from '../../../../../../components/DataTable.tsx';
import { ErrorState } from '../../../../../../components/ErrorState.tsx';
import { type DataTableColumn, PAGE_SIZE } from '../../../../../../components/DataTableFeatures.ts';
import { Select } from '../../../../../../components/Select.tsx';
import { Button } from '../../../../../../components/Button.tsx';

import { useOrganizations } from '../../../../hooks/organization-hook.ts';
import type { OrganizationResponse } from '../../../../../../models/organization.model.ts';
import { Order } from '../../../../../../models/enums/order.ts';
import { ActivationStatus } from '../../../../../../models/enums/activation-status.ts';
import { activationStatusRecord } from '../../../../../../models/enums-mapping/activation-status.ts';
import { useDialog } from '../../../../../../hooks/open-dialog.ts';
import { EditOrganizationDialog } from '../organizations/components/EditOrganizationDialog.tsx';
import { CreateOrganizationDialog } from '../organizations/components/CreateOrganizationDialog.tsx';
import { getOrganizationColumns } from '../organizations/columns/OrganizationColumns.tsx';

export function OrganizationsTable() {
    const [sorting, setSorting] = useState<SortingState>([]);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });

    const [search, setSearch] = useState('');

    const [status, setStatus] = useState<ActivationStatus | undefined>();

    const [createOpen, setCreateOpen] = useState(false);

    const organizationDialog = useDialog<OrganizationResponse>();

    const columns: DataTableColumn<OrganizationResponse>[] = getOrganizationColumns(
        organizationDialog.open,
    );

    const sort = sorting[0];

    const sortBy: 'name' | 'createdAtUTC' | undefined = sort
        ? sort.id === 'createdAtUTC'
            ? 'createdAtUTC'
            : 'name'
        : undefined;

    const order = sort ? (sort.desc ? Order.DESC : Order.ASC) : undefined;

    const { data, isError, isLoading, error, refetch } = useOrganizations({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy,
        order,
        search: search || undefined,
        filter: {
            ...(status && { status }),
        },
    });

    const filters = (
        <div className="flex min-w-0 flex-1 gap-2 max-sm:justify-between sm:gap-[4%]">
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
                        {activationStatusRecord[status]}
                    </option>
                ))}
            </Select>
        </div>
    );

    if (isError) {
        return (
            <ErrorState
                error={error}
                title="Failed to load organizations"
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <>
            <DataTable
                tableKey="organizations-table"
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
                        onClick={() => setCreateOpen(true)}
                        className="flex h-8 min-h-0 w-auto shrink-0 items-center gap-1.5 px-3 text-[11px]"
                    >
                        <Plus className="size-3.5" strokeWidth={2} />
                        New Organization
                    </Button>
                }
                rowCount={data?.pagination?.totalItems ?? 0}
                rowCountLabel={`${data?.pagination?.totalItems == 0 ? 'No' : `${data?.pagination.totalItems}`} Organizations`}
                isLoading={isLoading}
                emptyMessage="No organizations match the current filters."
            />

            <CreateOrganizationDialog open={createOpen} onOpenChange={setCreateOpen} />

            {organizationDialog.selectedItem && (
                <EditOrganizationDialog
                    organization={organizationDialog.selectedItem}
                    open={organizationDialog.isOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            organizationDialog.close();
                        }
                    }}
                />
            )}
        </>
    );
}
