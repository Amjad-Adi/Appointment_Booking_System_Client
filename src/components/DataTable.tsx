import type { ReactNode } from 'react';
import {
    flexRender,
    type OnChangeFn,
    type PaginationState,
    type RowData,
    type SortingState,
    useTable,
} from '@tanstack/react-table';
import { dataTableFeatures, type DataTableColumn } from './DataTableFeatures.ts';

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '../../@/components/ui/Table.tsx';

import { Pagination } from './Pagination.tsx';
import { Skeleton } from './Skeleton.tsx';
import { TextField } from './TextField.tsx';
import { DataViewToolbar } from './DataViewToolbar.tsx';

const SKELETON_ROW_COUNT = 6;

interface DataTableProps<TData extends RowData> {
    tableKey: string;
    data: TData[];
    columns: DataTableColumn<TData>[];
    sorting: SortingState;
    onSortingChange: OnChangeFn<SortingState>;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    search: string;
    onSearchChange: (value: string) => void;
    filters?: ReactNode;
    actions?: ReactNode;
    rowCount: number;
    rowCountLabel: string;
    isLoading?: boolean;
    emptyMessage?: string;
}

export function DataTable<TData extends RowData>({
    tableKey,
    data,
    columns,
    sorting,
    onSortingChange,
    pagination,
    onPaginationChange,
    search,
    onSearchChange,
    filters,
    actions,
    rowCount,
    rowCountLabel,
    isLoading = false,
    emptyMessage = 'No data found.',
}: DataTableProps<TData>) {
    const table = useTable({
        key: tableKey,
        features: dataTableFeatures,
        data,
        columns,
        state: {
            sorting,
            pagination,
        },
        onSortingChange,
        onPaginationChange,
        manualSorting: true,
        manualPagination: true,
        rowCount,
    });

    const handleSearchChange = (value: string) => {
        onSearchChange(value);

        onPaginationChange((previous) => ({
            ...previous,
            pageIndex: 0,
        }));
    };

    return (
        <div className="w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-border bg-card">
            <DataViewToolbar
                search={search}
                onSearchChange={handleSearchChange}
                filters={filters}
                actions={actions}
            />

            <div className="w-full min-w-0">
                <div className="w-full min-w-0">
                    <Table className="w-max min-w-full table-auto">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="border-0 bg-muted hover:bg-muted"
                                >
                                    {headerGroup.headers.map((header, index) => {
                                        const isLast = index === headerGroup.headers.length - 1;

                                        return (
                                            <TableHead
                                                key={header.id}
                                                className={`h-9 px-3 py-1 text-[11px] font-semibold whitespace-nowrap text-secondary-foreground ${
                                                    isLast ? 'text-right' : 'text-left'
                                                }`}
                                            >
                                                {header.isPlaceholder ? null : isLast ? (
                                                    <div className="flex justify-end">Actions</div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={header.column.getToggleSortingHandler()}
                                                        disabled={!header.column.getCanSort()}
                                                        className="inline-flex items-center rounded-md px-1 py-1 text-[11px] font-semibold whitespace-nowrap text-secondary-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-default"
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext(),
                                                        )}

                                                        {header.column.getIsSorted() === 'asc'
                                                            ? ' ↑'
                                                            : header.column.getIsSorted() === 'desc'
                                                              ? ' ↓'
                                                              : null}
                                                    </button>
                                                )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
                                    <TableRow
                                        key={`skeleton-${rowIndex}`}
                                        className="border-0 bg-card hover:bg-card"
                                    >
                                        {columns.map((_, columnIndex) => (
                                            <TableCell
                                                key={`skeleton-${rowIndex}-${columnIndex}`}
                                                className="py-2"
                                            >
                                                <Skeleton className="h-4 w-full min-w-16 rounded-md" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : table.getRowModel().rows.length === 0 ? (
                                <TableRow className="h-60 border-0 hover:bg-transparent">
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-60 p-0 text-center align-middle text-[11px] text-muted-foreground"
                                    >
                                        <div className="flex h-60 items-center justify-center">
                                            {emptyMessage}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="border-0 bg-card transition-colors hover:bg-secondary"
                                    >
                                        {row.getAllCells().map((cell, index) => {
                                            const isLast = index === row.getAllCells().length - 1;

                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    className={`py-1 text-[11px] whitespace-nowrap text-secondary-foreground ${
                                                        isLast ? 'text-right' : 'text-left'
                                                    }`}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext(),
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>

                        <TableFooter>
                            <TableRow className="border-0 bg-muted hover:bg-muted">
                                <TableCell colSpan={columns.length} className="p-2">
                                    <div className="flex w-full min-w-0 items-center justify-between gap-3">
                                        <span className="min-w-0 truncate text-[11px] font-medium text-muted-foreground">
                                            {rowCountLabel}
                                        </span>

                                        <Pagination
                                            pageIndex={pagination.pageIndex}
                                            pageSize={pagination.pageSize}
                                            rowCount={rowCount}
                                            onPageChange={(nextPageIndex) =>
                                                onPaginationChange((previous) => ({
                                                    ...previous,
                                                    pageIndex: nextPageIndex,
                                                }))
                                            }
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </div>
    );
}
