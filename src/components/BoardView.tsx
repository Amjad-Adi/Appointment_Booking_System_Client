import type { ReactNode } from 'react';
import type { OnChangeFn, PaginationState } from '@tanstack/react-table';

import { DataViewToolbar } from './DataViewToolbar.tsx';
import { Grid } from './Grid.tsx';
import { LoadingState } from './LoadingState.tsx';
import { Pagination } from './Pagination.tsx';

interface BoardViewProps<T> {
    items: T[];
    getKey: (item: T) => React.Key;
    renderItem: (item: T) => ReactNode;
    search: string;
    onSearchChange: (value: string) => void;
    filters?: ReactNode;
    actions?: ReactNode;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    rowCount: number;
    rowCountLabel: string;
    isLoading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    gridClassName?: string;
}

export function BoardView<T>({
    items,
    getKey,
    renderItem,
    search,
    onSearchChange,
    filters,
    actions,
    pagination,
    onPaginationChange,
    rowCount,
    rowCountLabel,
    isLoading = false,
    emptyTitle,
    emptyDescription,
    gridClassName,
}: BoardViewProps<T>) {
    return (
        <div className="w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-border bg-card">
            <DataViewToolbar
                search={search}
                onSearchChange={onSearchChange}
                filters={filters}
                actions={actions}
            />

            <div className="border-t border-border bg-card p-2 sm:p-3">
                {isLoading ? (
                    <LoadingState label="Loading..." />
                ) : (
                    <Grid
                        items={items}
                        getKey={getKey}
                        renderItem={renderItem}
                        emptyTitle={emptyTitle}
                        emptyDescription={emptyDescription}
                        className={gridClassName}
                    />
                )}
            </div>

            <div className="flex w-full min-w-0 items-center justify-between gap-3 border-t border-border bg-muted p-2">
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
        </div>
    );
}
