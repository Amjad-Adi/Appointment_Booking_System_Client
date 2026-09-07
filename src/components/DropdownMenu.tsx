'use client';

import * as React from 'react';
import { Menu } from '@base-ui/react/menu';
import { cn } from 'cn';

function DropdownMenu({ children }: { children: React.ReactNode }) {
    return <Menu.Root>{children}</Menu.Root>;
}

function DropdownMenuTrigger({
    children,
    className,
    ...props
}: React.ComponentProps<typeof Menu.Trigger>) {
    return (
        <Menu.Trigger
            className={cn('inline-flex items-center justify-center rounded-md', className)}
            {...props}
        >
            {children}
        </Menu.Trigger>
    );
}
function DropdownMenuContent({
    children,
    className,
    ...props
}: React.ComponentProps<typeof Menu.Popup>) {
    return (
        <Menu.Portal>
            <Menu.Positioner sideOffset={4}>
                <Menu.Popup
                    className={cn(
                        'z-50 min-w-36 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg',
                        className,
                    )}
                    {...props}
                >
                    {children}
                </Menu.Popup>
            </Menu.Positioner>
        </Menu.Portal>
    );
}

function DropdownMenuItem({
    children,
    className,
    ...props
}: React.ComponentProps<typeof Menu.Item>) {
    return (
        <Menu.Item
            className={cn(
                'flex cursor-pointer items-center rounded-md px-2.5 py-2 text-sm font-medium text-slate-700 outline-none',
                'hover:bg-slate-100 hover:text-slate-900',
                'focus:bg-slate-100 focus:text-slate-900',
                className,
            )}
            {...props}
        >
            {children}
        </Menu.Item>
    );
}

function DropdownMenuSeparator({
    className,
    ...props
}: React.ComponentProps<typeof Menu.Separator>) {
    return <Menu.Separator className={cn('my-1 h-px bg-slate-200', className)} {...props} />;
}
export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
};
