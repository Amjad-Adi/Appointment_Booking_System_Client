import * as React from 'react';
import { cn } from '../../../src/utlis/cn.ts';

function Table({ className, ...props }: React.ComponentProps<'table'>) {
    return (
        <div
            data-slot="table-container"
            className="relative w-full min-w-0 overflow-x-auto bg-[#f5f5f8]"
        >
            <table
                data-slot="table"
                className={cn(
                    'caption-bottom text-center text-xs text-[#454556] sm:text-sm',
                    className,
                )}
                {...props}
            />
        </div>
    );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
    return <thead data-slot="table-header" className={cn('bg-[#dedee8]', className)} {...props} />;
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
            className={cn('bg-[#dedee8] font-medium text-[#454556]', className)}
            {...props}
        />
    );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                'border-0 bg-[#f5f5f8] transition-colors duration-150',
                'hover:bg-[#ededf2]',
                'data-[state=selected]:bg-[#e3e3eb]',
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
                'h-9 px-3 text-left align-middle text-[11px] font-semibold whitespace-nowrap text-[#454556]',
                'sm:h-10',
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
                'px-3 text-left align-middle text-[11px] whitespace-nowrap text-[#454556]',
                '[&:has([role=checkbox])]:pr-0',
                className,
            )}
            {...props}
        />
    );
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
    return (
        <caption data-slot="table-caption" className={cn('h-10', className)} {...props}>
            <div className="flex h-full items-center justify-center text-center text-[10px] text-[#777789] sm:text-[12px]">
                {props.children}
            </div>
        </caption>
    );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
