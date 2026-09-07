import type { ColumnDef, RowData } from '@tanstack/react-table';

import {
    columnFilteringFeature,
    globalFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
    tableFeatures,
} from '@tanstack/react-table';

export const dataTableFeatures = tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
});

export const PAGE_SIZE = 20;

export type DataTableColumn<TData extends RowData> = ColumnDef<typeof dataTableFeatures, TData>;
