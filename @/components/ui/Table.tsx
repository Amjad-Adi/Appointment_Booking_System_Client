import * as React from 'react';
import { cn } from '../../../src/utlis/cn.ts';

function Table({ className, ...props }: React.ComponentProps<'table'>) {
    return (
        <div
            data-slot="table-container"
            className="border-secondary relative w-full overflow-x-auto rounded-[20px] border-[3px] bg-[#e9e9f1] p-2 shadow-xl sm:p-4"
        >
            <table
                data-slot="table"
                className={cn(
                    'w-full caption-bottom text-center text-xs text-[#222] sm:text-sm',
                    className,
                )}
                {...props}
            />
        </div>
    );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
    return (
        <thead
            data-slot="table-header"
            className={cn(
                'border-b border-[#ccc] bg-[#dfdfe9]',
                '[&_tr]:border-b [&_tr]:border-[#ccc]',
                className,
            )}
            {...props}
        />
    );
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
    return (
        <tbody
            data-slot="table-body"
            className={cn('[&_tr:last-child]:border-0', className)}
            {...props}
        />
    );
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn(
                'border-t border-[#ccc] bg-[#dfdfe9]',
                'font-bold text-[#222]',
                '[&>tr]:last:border-b-0',
                className,
            )}
            {...props}
        />
    );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                'border-b border-[#ccc] transition-colors duration-150',
                'hover:bg-[#d8d8e5]',
                'data-[state=selected]:bg-action/20',
                className,
            )}
            {...props}
        />
    );
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                'h-10 px-3 text-center align-middle font-bold whitespace-nowrap text-[#222] sm:h-12 sm:px-4',
                'has-[[role=checkbox]]:pr-0',
                className,
            )}
            {...props}
        />
    );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
    return (
        <td
            data-slot="table-cell"
            className={cn(
                'p-3 text-center align-middle whitespace-nowrap text-[#333] sm:p-4',
                '[&:has([role=checkbox])]:pr-0',
                className,
            )}
            {...props}
        />
    );
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
    return (
        <caption
            data-slot="table-caption"
            className={cn('mt-3 text-center text-[10px] text-[#777] sm:text-[12px]', className)}
            {...props}
        />
    );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
