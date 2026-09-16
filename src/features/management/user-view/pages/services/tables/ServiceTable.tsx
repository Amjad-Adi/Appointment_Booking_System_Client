import { useState } from 'react';
import { type PaginationState, type SortingState } from '@tanstack/react-table';
import { Plus } from 'lucide-react';

import { DataTable } from '../../../../../../components/DataTable.tsx';
import { PAGE_SIZE } from '../../../../../../components/DataTableFeatures.ts';
import { Select } from '../../../../../../components/Select.tsx';
import { Button } from '../../../../../../components/Button.tsx';

import { Order } from '../../../../../../models/enums/order.ts';
import { ActivationStatus } from '../../../../../../models/enums/activation-status.ts';
import { Role } from '../../../../../../models/enums/roles.ts';

import { GENERAL_DEBOUNCE_DELAY, useDebounce } from '../../../../../../hooks/deounce.ts';

import { useServices } from '../../../../hooks/services-hook.ts';
import { useServiceCategories } from '../../../../hooks/service-categories-hook.ts';
import { useCurrentUser } from '../../../../hooks/users-hook.ts';

import { getServiceColumns } from '../columns/ServiceColumns.tsx';
import { ServiceCategorySelector } from '../../../../components/ServiceCategorySelector.tsx';

import { useDialog } from '../../../../../../hooks/open-dialog.ts';

import type { ServiceResponse } from '../../../../../../models/service.model.ts';

import { CreateServiceDialog } from '../components/CreateServiceDialog.tsx';
import { EditServiceDialog } from '../components/EditServiceDialog.tsx';
import { TextField } from '../../../../../../components/TextField.tsx';
import { ViewMode } from '../../../../../../models/enums/ViewMode.ts';
import { ServiceViewSwitcher } from '../components/ServiceViewSwitcher.tsx';
import { ServicesGrid } from '../grids/ServiceGrid.tsx';

interface ServicesTableProps {
    organizationUuid?: string;
}

export function ServicesTable({ organizationUuid }: ServicesTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });

    const [search, setSearch] = useState('');
    const debounceSearch = useDebounce(search, GENERAL_DEBOUNCE_DELAY);

    const [serviceCategoryUuid, setServiceCategoryUuid] = useState<string | undefined>();

    const [status, setStatus] = useState<ActivationStatus | undefined>();
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [maxDurationInMinutes, setMaxDurationInMinutes] = useState(0);

    const debounceMinPrice = useDebounce(minPrice, GENERAL_DEBOUNCE_DELAY);
    const debounceMaxPrice = useDebounce(maxPrice, GENERAL_DEBOUNCE_DELAY);
    const debounceMaxDurationInMinutes = useDebounce(maxDurationInMinutes, GENERAL_DEBOUNCE_DELAY);
    const [createServiceOpen, setCreateServiceOpen] = useState(false);

    const serviceDialog = useDialog<ServiceResponse>();
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.TABLE);
    const { data: currentUser } = useCurrentUser();
    const canManageServices =
        (currentUser?.role === Role.MANAGER || currentUser?.role === Role.OWNER) &&
        currentUser?.organizationUuid != null;
    const sort = sorting[0];
    const isCustomer = currentUser?.role === Role.CUSTOMER;

    const effectiveViewMode = isCustomer ? ViewMode.GRID : viewMode;
    const handleViewModeChange = (mode: ViewMode) => {
        if (isCustomer) {
            return;
        }
        setViewMode(mode);
    };
    const sortBy: 'name' | 'price' | 'durationInMinutes' | 'createdAtUTC' | undefined = sort
        ? sort.id === 'name'
            ? 'name'
            : sort.id === 'price'
              ? 'price'
              : sort.id === 'durationInMinutes'
                ? 'durationInMinutes'
                : 'createdAtUTC'
        : undefined;

    const order = sort ? (sort.desc ? Order.DESC : Order.ASC) : undefined;

    const { data, isLoading, isError } = useServices({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy,
        order,
        search: debounceSearch || undefined,
        filter: {
            organizationUuid,
            ...(serviceCategoryUuid && {
                serviceCategoryUuid,
            }),
            ...(debounceMinPrice > 0 && {
                minPrice: debounceMinPrice,
            }),
            ...(debounceMaxPrice > 0 && {
                maxPrice: debounceMaxPrice,
            }),
            ...(debounceMaxDurationInMinutes > 0 && {
                maxDurationInMinutes: debounceMaxDurationInMinutes,
            }),
            ...(status && {
                status,
            }),
        },
    });

    const { data: categoriesData } = useServiceCategories({
        page: 1,
        limit: 100,
    });

    const columns = getServiceColumns(canManageServices ? serviceDialog.open : undefined);

    const resetPage = () => {
        setPagination((previous) => ({
            ...previous,
            pageIndex: 0,
        }));
    };

    const handleCategoryChange = (categoryUuid?: string) => {
        setServiceCategoryUuid(categoryUuid);
        resetPage();
    };
    const handleSearchChange = (value: string) => {
        setSearch(value);
        resetPage();
    };
    const filters = (
        <div className="flex w-full min-w-0 flex-wrap items-center gap-2">
            <Select
                label="Status"
                isLabelDisabled
                value={status ?? ''}
                onChange={(event) => {
                    const value = event.target.value;

                    setStatus(value === '' ? undefined : (value as ActivationStatus));

                    resetPage();
                }}
                wrapperClassName="w-36 max-sm:w-[48%] max-[350px]:w-full"
                className="!h-8 px-2 text-[11px]"
            >
                <option value="">All statuses</option>

                {Object.values(ActivationStatus).map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </Select>
            <TextField
                label="Min price"
                isLabelDisabled
                type="number"
                min="0"
                placeholder="Min price"
                value={minPrice || ''}
                onChange={(event) => {
                    setMinPrice(event.target.value === '' ? 0 : Number(event.target.value));
                    resetPage();
                }}
                wrapperClassName="w-32 max-sm:w-[48%] max-[350px]:w-full"
                className="px-2 text-[11px]"
            />
            <TextField
                label="Max price"
                isLabelDisabled
                type="number"
                min="0"
                placeholder="Max price"
                value={maxPrice || ''}
                onChange={(event) => {
                    setMaxPrice(event.target.value === '' ? 0 : Number(event.target.value));
                    resetPage();
                }}
                wrapperClassName="w-32 max-sm:w-[48%] max-[350px]:w-full"
                className="px-2 text-[11px]"
            />
            <TextField
                label="Max duration"
                isLabelDisabled
                type="number"
                min="0"
                placeholder="Max duration"
                value={maxDurationInMinutes || ''}
                onChange={(event) => {
                    setMaxDurationInMinutes(
                        event.target.value === '' ? 0 : Number(event.target.value),
                    );
                    resetPage();
                }}
                wrapperClassName="w-32 max-sm:w-[48%] max-[350px]:w-full"
                className="px-2 text-[11px]"
            />
        </div>
    );
    const actions = (
        <div className="flex shrink-0 items-center gap-2">
            {!isCustomer && (
                <ServiceViewSwitcher value={effectiveViewMode} onChange={handleViewModeChange} />
            )}

            {canManageServices && (
                <Button
                    type="button"
                    onClick={() => setCreateServiceOpen(true)}
                    className="flex h-8 min-h-0 w-auto shrink-0 items-center gap-1.5 px-3 text-[11px]"
                >
                    <Plus className="size-3.5" strokeWidth={2} />
                    Add Service
                </Button>
            )}
        </div>
    );
    if (isLoading) {
        return <div>Loading services...</div>;
    }

    if (isError) {
        return <div>Failed to load services.</div>;
    }

    return (
        <>
            <ServiceCategorySelector
                categories={categoriesData?.data ?? []}
                selectedCategoryUuid={serviceCategoryUuid}
                onSelect={handleCategoryChange}
            />

            {effectiveViewMode === ViewMode.TABLE ? (
                <DataTable
                    tableKey="organization-services-table"
                    data={data?.data ?? []}
                    columns={columns}
                    sorting={sorting}
                    onSortingChange={setSorting}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    search={search}
                    onSearchChange={handleSearchChange}
                    filters={filters}
                    actions={actions}
                    rowCount={data?.pagination?.totalItems ?? 0}
                    rowCountLabel={`${
                        data?.pagination?.totalItems === 0 ? 'No' : data?.pagination?.totalItems
                    } Services`}
                />
            ) : (
                <ServicesGrid
                    services={data?.data ?? []}
                    search={search}
                    onSearchChange={handleSearchChange}
                    filters={filters}
                    actions={actions}
                    canEdit={canManageServices}
                    onEdit={serviceDialog.open}
                />
            )}

            {canManageServices && (
                <CreateServiceDialog
                    organizationUuid={organizationUuid}
                    categories={categoriesData?.data ?? []}
                    open={createServiceOpen}
                    onOpenChange={setCreateServiceOpen}
                />
            )}

            {canManageServices && serviceDialog.selectedItem && (
                <EditServiceDialog
                    organizationUuid={organizationUuid}
                    service={serviceDialog.selectedItem}
                    open={serviceDialog.isOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            serviceDialog.close();
                        }
                    }}
                />
            )}
        </>
    );
}
