import { useState } from 'react';
import { type PaginationState, type SortingState } from '@tanstack/react-table';

import { DataTable } from '../../../../../../components/DataTable.tsx';
import {
    type DataTableColumn,
    PAGE_SIZE,
} from '../../../../../../components/DataTableFeatures.ts';
import { Select } from '../../../../../../components/Select.tsx';

import { useOrganizations } from '../../../../hooks/orgsnization-hook.ts';
import type { OrganizationResponse } from '../../../../../../models/organization.model.ts';
import { Order } from '../../../../../../models/enums/order.ts';
import { ActivationStatus } from '../../../../../../models/enums/activation-status.ts';
import {
    GENERAL_DEBOUNCE_DELAY,
    useDebounce,
} from '../../../../../../hooks/deounce.ts';
import { useDialog } from '../../../../../../hooks/open-dialog.ts';
import { EditOrganizationDialog } from '../components/EditOrganizationDialog.tsx';
import { getOrganizationColumns } from '../columns/OrganizationColumns.tsx';

export function OrganizationsTable() {
    const [sorting, setSorting] = useState<SortingState>([]);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });

    const [search, setSearch] = useState('');
    const debounceSearch = useDebounce(
        search,
        GENERAL_DEBOUNCE_DELAY,
    );

    const [status, setStatus] = useState<ActivationStatus | undefined>();

    const organizationDialog = useDialog<OrganizationResponse>();

    const columns: DataTableColumn<OrganizationResponse>[] =
        getOrganizationColumns(organizationDialog.open);

    const sort = sorting[0];

    const sortBy:
        | 'name'
        | 'createdAtUTC'
        | undefined = sort
        ? sort.id === 'createdAtUTC'
            ? 'createdAtUTC'
            : 'name'
        : undefined;

    const order = sort
        ? sort.desc
            ? Order.DESC
            : Order.ASC
        : undefined;

    const { data, isError, isLoading } = useOrganizations({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy,
        order,
        search: debounceSearch || undefined,
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

                    setStatus(
                        value === ''
                            ? undefined
                            : (value as ActivationStatus),
                    );

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
        return <div>Loading organizations...</div>; // Needs Improvement
    }

    if (isError) {
        return <div>Failed to load organizations.</div>;
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
                rowCount={data?.pagination?.totalItems ?? 0}
                rowCountLabel={`${data?.pagination?.totalItems == 0 ? 'No' : `${data?.pagination.totalItems}`} Organizations`}
            />

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
