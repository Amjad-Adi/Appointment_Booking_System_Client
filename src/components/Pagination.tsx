import { ChevronLeft, ChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface PaginationProps {
    pageIndex: number;
    pageSize: number;
    rowCount: number;
    onPageChange: (pageIndex: number) => void;
    className?: string;
}

const CONTROL_CLASS =
    'flex h-7 min-h-0 w-7 min-w-0 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border-strong bg-transparent p-0 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground';

type PageItem = number | 'start-gap' | 'end-gap';

function getPageItems(pageIndex: number, pageCount: number): PageItem[] {
    if (pageCount <= 7) {
        return Array.from({ length: pageCount }, (_, index) => index);
    }

    const items: PageItem[] = [0];
    const start = Math.max(1, pageIndex - 1);
    const end = Math.min(pageCount - 2, pageIndex + 1);

    if (start > 1) {
        items.push('start-gap');
    }

    for (let page = start; page <= end; page += 1) {
        items.push(page);
    }

    if (end < pageCount - 2) {
        items.push('end-gap');
    }

    items.push(pageCount - 1);

    return items;
}

export function Pagination({
    pageIndex,
    pageSize,
    rowCount,
    onPageChange,
    className,
}: PaginationProps) {
    const pageCount = Math.max(1, Math.ceil(rowCount / Math.max(1, pageSize)));
    const currentPage = Math.min(Math.max(pageIndex, 0), pageCount - 1);

    const canGoPrevious = currentPage > 0;
    const canGoNext = currentPage < pageCount - 1;

    return (
        <nav
            aria-label="Pagination"
            className={twMerge('flex min-w-0 items-center gap-2', className)}
        >
            <span className="min-w-0 truncate text-[11px] font-medium text-muted-foreground">
                Page {currentPage + 1} of {pageCount}
            </span>

            <div className="flex shrink-0 items-center gap-1">
                <button
                    type="button"
                    disabled={!canGoPrevious}
                    onClick={() => onPageChange(currentPage - 1)}
                    aria-label="Previous page"
                    className={CONTROL_CLASS}
                >
                    <ChevronLeft className="size-4 shrink-0" strokeWidth={2} />
                </button>

                <div className="hidden items-center gap-1 sm:flex">
                    {getPageItems(currentPage, pageCount).map((item) => {
                        if (item === 'start-gap' || item === 'end-gap') {
                            return (
                                <span
                                    key={item}
                                    aria-hidden="true"
                                    className="flex h-7 w-5 items-center justify-center text-[11px] text-muted-foreground"
                                >
                                    …
                                </span>
                            );
                        }

                        const isActive = item === currentPage;

                        return (
                            <button
                                key={item}
                                type="button"
                                onClick={() => onPageChange(item)}
                                aria-label={`Go to page ${item + 1}`}
                                aria-current={isActive ? 'page' : undefined}
                                className={twMerge(
                                    'flex h-7 min-h-0 min-w-7 cursor-pointer items-center justify-center rounded-md px-1.5 text-[11px] font-semibold transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-secondary-foreground hover:bg-secondary hover:text-foreground',
                                )}
                            >
                                {item + 1}
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    disabled={!canGoNext}
                    onClick={() => onPageChange(currentPage + 1)}
                    aria-label="Next page"
                    className={CONTROL_CLASS}
                >
                    <ChevronRight className="size-4 shrink-0" strokeWidth={2} />
                </button>
            </div>
        </nav>
    );
}
