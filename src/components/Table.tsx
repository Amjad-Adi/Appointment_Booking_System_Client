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
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '../../@/components/ui/Table.tsx';

import { Button } from './Button.tsx';

interface DataTableProps<TData extends RowData> {
    tableKey: string;
    data: TData[];
    columns: DataTableColumn<TData>[];
    caption?: string;
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
    caption,
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
        <div className="w-full">
            <div className="mb-3 flex flex-col items-center justify-center gap-2 text-xs sm:flex-row sm:justify-between">
                <div className="flex w-full flex-col items-center justify-center gap-2 sm:flex-row sm:justify-start">
                    <input
                        type="search"
                        placeholder="Search..."
                        value={search}
                        onChange={(event) => handleSearchChange(event.target.value)}
                        className="h-8 w-full rounded-md border px-2 text-xs sm:max-w-xs"
                    />

                    {filters}
                </div>

                <span className="text-muted-foreground text-xs">{rowCountLabel}</span>
            </div>
            <div className="w-full overflow-x-auto">
                <Table className="w-full min-w-full">
                    {caption && <TableCaption>{caption}</TableCaption>}
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header, index) => {
                                    const isLast = index === headerGroup.headers.length - 1;

                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="h-9 px-2 py-1 text-xs"
                                        >
                                            {header.isPlaceholder ? null : isLast ? (
                                                'Actions'
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    disabled={!header.column.getCanSort()}
                                                    className="inline-flex items-center text-xs"
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}

                                                    {{
                                                        asc: ' ↑',
                                                        desc: ' ↓',
                                                    }[header.column.getIsSorted() as string] ??
                                                        null}
                                                </button>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="min-h-60">
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow className="h-60">
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-60 p-0 text-center align-middle text-xs"
                                >
                                    <div className="flex h-60 items-center justify-center">
                                        No users found.
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getAllCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-2 py-1 text-xs">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={columns.length} className="p-2">
                                <div className="flex w-full items-center justify-center gap-3">
                                    <Button
                                        type="button"
                                        disabled={!table.getCanPreviousPage()}
                                        onClick={() => table.previousPage()}
                                        className="h-8 rounded-md px-3 text-xs"
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-foreground text-xs font-medium">
                                        Page {pagination.pageIndex + 1} of {table.getPageCount()}
                                    </span>
                                    <Button
                                        type="button"
                                        disabled={!table.getCanNextPage()}
                                        onClick={() => table.nextPage()}
                                        className="h-8 rounded-md px-3 text-xs"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    );
}
