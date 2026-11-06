interface GridProps<T> {
    items: T[];
    getKey: (item: T) => React.Key;
    renderItem: (item: T) => React.ReactNode;
    emptyTitle?: string;
    emptyDescription?: string;
    className?: string;
}

export function Grid<T>({
    items,
    getKey,
    renderItem,
    emptyTitle = 'No items found',
    emptyDescription = 'Try changing your search or filters.',
    className = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}: GridProps<T>) {
    if (items.length === 0) {
        return (
            <div className="flex min-h-56 w-full items-center justify-center rounded-xl border border-dashed border-border bg-card">
                <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">{emptyTitle}</p>

                    <p className="mt-1 text-[11px] text-muted-foreground">{emptyDescription}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            {items.map((item) => (
                <div key={getKey(item)}>{renderItem(item)}</div>
            ))}
        </div>
    );
}
