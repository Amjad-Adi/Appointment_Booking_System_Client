import type { ColumnDef, RowData } from '@tanstack/react-table';

import {
    columnFilteringFeature,
    globalFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
    tableFeatures,
} from '@tanstack/react-table';

export const dataTableFeatures = tableFeatures({
    rowPaginationFeature,
    rowSortingFeature,
});

export const PAGE_SIZE = 20;

export type DataTableColumn<T extends RowData> = ColumnDef<typeof dataTableFeatures, T>;
