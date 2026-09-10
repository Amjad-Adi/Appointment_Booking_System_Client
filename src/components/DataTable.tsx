import type { ReactNode } from 'react';
import {
    flexRender,
    type OnChangeFn,
    type PaginationState,
    type RowData,
    type SortingState,
    useTable,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

import { Button } from './Button.tsx';
import { Input } from './Input.tsx';

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
    rowCount: number;
    rowCountLabel: string;
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
    rowCount,
    rowCountLabel,
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
        <div className="w-full max-w-full min-w-0">
            <div className="w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-[#dedee8] bg-[#f5f5f8]">
                <div className="flex min-w-0 flex-col gap-2 bg-[#dedee8] p-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-[4%]">
                        <Input
                            type="search"
                            placeholder="Search..."
                            id="search"
                            value={search}
                            onChange={(event) => handleSearchChange(event.target.value)}
                            className="!h-8 w-full min-w-0 !text-[11px] sm:w-56 sm:max-w-xs sm:flex-1"
                        />

                        {filters}
                    </div>
                </div>

                <div className="w-full min-w-0">
                    <Table className="w-max min-w-full table-auto">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="border-0 bg-[#dedee8] hover:bg-[#dedee8]"
                                >
                                    {headerGroup.headers.map((header, index) => {
                                        const isLast = index === headerGroup.headers.length - 1;

                                        return (
                                            <TableHead
                                                key={header.id}
                                                className={`h-9 px-3 py-1 text-[11px] font-semibold whitespace-nowrap text-[#454556] ${
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
                                                        className="inline-flex items-center rounded-md px-1 py-1 text-[11px] font-semibold whitespace-nowrap text-[#454556] transition-colors hover:bg-[#d3d3df] hover:text-[#343447] disabled:cursor-default"
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
                            {table.getRowModel().rows.length === 0 ? (
                                <TableRow className="h-60 border-0 hover:bg-transparent">
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-60 p-0 text-center align-middle text-[11px] text-[#777789]"
                                    >
                                        <div className="flex h-60 items-center justify-center">
                                            No data found.
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="border-0 bg-[#f5f5f8] transition-colors hover:bg-[#ededf2]"
                                    >
                                        {row.getAllCells().map((cell, index) => {
                                            const isLast = index === row.getAllCells().length - 1;

                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    className={`py-1 text-[11px] whitespace-nowrap text-[#454556] ${
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
                            <TableRow className="border-0 bg-[#dedee8] hover:bg-[#dedee8]">
                                <TableCell colSpan={columns.length} className="p-2">
                                    <div className="flex w-full min-w-0 items-center justify-between">
                                        <span className="min-w-0 truncate text-[11px] font-medium text-[#666679]">
                                            {rowCountLabel}
                                        </span>

                                        <div className="flex shrink-0 items-center">
                                            <div className="group">
                                                <Button
                                                    type="button"
                                                    disabled={!table.getCanPreviousPage()}
                                                    onClick={() => table.previousPage()}
                                                    aria-label="Previous page"
                                                    className="flex h-7 min-h-0 w-7 min-w-0 shrink-0 items-center justify-center border border-[#b9b9cc] bg-transparent p-0 text-[#666679] group-hover:bg-[#ededf2] group-hover:text-[#343447] disabled:cursor-not-allowed disabled:opacity-40 disabled:group-hover:bg-transparent disabled:group-hover:text-[#666679] sm:h-7 sm:w-7 sm:px-0 md:h-7 md:w-7 md:px-0"
                                                >
                                                    <ChevronLeft
                                                        className="size-4 shrink-0"
                                                        strokeWidth={2}
                                                    />
                                                </Button>
                                            </div>

                                            <span className="flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-[11px] font-semibold text-[#454556]">
                                                {pagination.pageIndex + 1}
                                            </span>

                                            <div className="group">
                                                <Button
                                                    type="button"
                                                    disabled={!table.getCanNextPage()}
                                                    onClick={() => table.nextPage()}
                                                    aria-label="Next page"
                                                    className="flex h-7 min-h-0 w-7 min-w-0 shrink-0 items-center justify-center border border-[#b9b9cc] bg-transparent p-0 text-[#666679] group-hover:bg-[#ededf2] group-hover:text-[#343447] disabled:cursor-not-allowed disabled:opacity-40 disabled:group-hover:bg-transparent disabled:group-hover:text-[#666679] sm:h-7 sm:w-7 sm:px-0 md:h-7 md:w-7 md:px-0"
                                                >
                                                    <ChevronRight
                                                        className="size-4 shrink-0"
                                                        strokeWidth={2}
                                                    />
                                                </Button>
                                            </div>
                                        </div>
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
