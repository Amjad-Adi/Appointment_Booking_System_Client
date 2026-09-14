import type { ReactNode } from 'react';

import { TextField } from './TextField.tsx';

interface DataViewToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    filters?: ReactNode;
    actions?: ReactNode;
}

export function DataViewToolbar({
    search,
    onSearchChange,
    filters,
    actions,
}: DataViewToolbarProps) {
    return (
        <div className="flex min-w-0 flex-col gap-2 rounded-t-xl border border-[#dedee8] bg-[#dedee8] p-2">
            {/* Primary controls */}
            <div className="flex min-w-0 items-center justify-between gap-2">
                <TextField
                    type="search"
                    placeholder="Search..."
                    id="search"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    wrapperClassName="w-full min-w-0 sm:w-56 sm:max-w-xs"
                    className="!h-8 !text-[11px]"
                    label="Search"
                    isLabelDisabled
                />

                {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
            </div>

            {/* Filters */}
            {filters && (
                <div className="flex w-full min-w-0 flex-wrap items-center gap-2">{filters}</div>
            )}
        </div>
    );
}
