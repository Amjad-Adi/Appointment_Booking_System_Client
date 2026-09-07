import type { ReactNode } from 'react';
import {
    type OnChangeFn,
    type PaginationState,
    type RowData,
    type SortingState,
    useTable,
} from '@tanstack/react-table';
import { dataTableFeatures, type DataTableColumn } from './ui/DataTableFeatures';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/Table.tsx';
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
}: DataTableProps<TData>) {
    const table = useTable({
        key: tableKey,
        features: dataTableFeatures,
        data,
        columns,
        state: { sorting, pagination },
        onSortingChange,
        onPaginationChange,
        manualSorting: true,
        manualFiltering: true,
        manualPagination: true,
        rowCount,
    });
    const handleSearchChange = (value: string) => {
        onSearchChange(value);
        onPaginationChange((previous) => ({ ...previous, pageIndex: 0 }));
    };
    return (
        <div className="space-y-4">
            {' '}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {' '}
                <input
                    type="search"
                    placeholder="Search users..."
                    value={search}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    className="h-10 w-full rounded-md border px-3 text-sm sm:max-w-sm"
                />{' '}
                {filters}{' '}
            </div>{' '}
            <Table>
                {' '}
                {caption && <TableCaption>{caption}</TableCaption>}{' '}
                <TableHeader>
                    {' '}
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {' '}
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {' '}
                                    {header.isPlaceholder ? null : (
                                        <button
                                            type="button"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {' '}
                                            <table.FlexRender header={header} />{' '}
                                            {{ asc: ' ↑', desc: ' ↓' }[
                                                header.column.getIsSorted() as string
                                            ] ?? null}{' '}
                                        </button>
                                    )}{' '}
                                </TableHead>
                            ))}{' '}
                        </TableRow>
                    ))}{' '}
                </TableHeader>{' '}
                <TableBody>
                    {' '}
                    {table.getRowModel().rows.length === 0 ? (
                        <TableRow>
                            {' '}
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                {' '}
                                No users found.{' '}
                            </TableCell>{' '}
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {' '}
                                {row.getAllCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {' '}
                                        <table.FlexRender cell={cell} />{' '}
                                    </TableCell>
                                ))}{' '}
                            </TableRow>
                        ))
                    )}{' '}
                </TableBody>{' '}
            </Table>{' '}
        </div>
    );
}
