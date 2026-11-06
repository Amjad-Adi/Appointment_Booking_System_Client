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
                        'z-50 min-w-36 rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-lg',
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
                'flex cursor-pointer items-center rounded-md px-2.5 py-2 text-sm font-medium text-foreground outline-none',
                'hover:bg-muted hover:text-foreground',
                'focus:bg-muted focus:text-foreground',
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
    return <Menu.Separator className={cn('my-1 h-px bg-border', className)} {...props} />;
}
export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
};
