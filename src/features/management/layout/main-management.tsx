import { Outlet, useLocation } from 'react-router';

import { AppSidebar } from '../../../components/sidebar/AppSideBar.tsx';
import { ThemeToggle } from '../../../components/ThemeToggle.tsx';
import { SidebarProvider, SidebarTrigger } from '../../../../@/components/ui/sidebar.tsx';
import type { SidebarProps } from '../../../components/sidebar/sidebar.types.ts';

type ManagementLayoutProps = {
    sidebar: SidebarProps;
};

export function ManagementLayout({ sidebar }: ManagementLayoutProps) {
    const location = useLocation();
    const allItems = sidebar.groups.flatMap((group) => group.items);
    const activeItem =
        allItems.find((item) => location.pathname === item.url) ||
        allItems
            .filter((item) => item.url !== '/' && location.pathname.startsWith(`${item.url}/`))
            .sort((a, b) => b.url.length - a.url.length)[0];
    const ActiveIcon = activeItem?.icon;
    return (
        <SidebarProvider className="flex h-svh w-full overflow-hidden">
            <AppSidebar {...sidebar} />
            <div className="flex min-h-svh min-w-0 flex-1 flex-col bg-background">
                <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-border px-4">
                    <div className="flex min-w-0 flex-1 items-center">
                        <SidebarTrigger className="mr-3 shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground" />

                        <div className="h-5 w-px shrink-0 bg-border" />

                        <div className="ml-4 flex min-w-0 items-center gap-2">
                            {ActiveIcon && (
                                <ActiveIcon
                                    className="size-[17px] shrink-0 text-secondary-foreground"
                                    strokeWidth={2.25}
                                />
                            )}

                            <h1 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
                                {activeItem?.title ?? 'Dashboard'}
                            </h1>
                        </div>
                    </div>

                    <ThemeToggle />
                </header>

                <main className="h-full min-w-0 flex-1 overflow-y-auto px-[1%]">
                    {' '}
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    );
}
