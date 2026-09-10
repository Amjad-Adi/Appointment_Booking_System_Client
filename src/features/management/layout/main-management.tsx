import { Outlet, useLocation } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { CircleUserRound, UserCircle } from 'lucide-react';

import type { UserResponse } from '../../../models/user.model.ts';
import { AppSidebar } from '../../../components/sidebar/AppSideBar.tsx';
import { SidebarProvider, SidebarTrigger } from '../../../../@/components/ui/sidebar.tsx';
import type { SidebarProps } from '../../../components/sidebar/sidebar.types.ts';
import { CURRENT_USER } from '../../../utlis/query-keys.ts';

type ManagementLayoutProps = {
    sidebar: SidebarProps;
};

export function ManagementLayout({ sidebar }: ManagementLayoutProps) {
    const queryClient = useQueryClient();
    const location = useLocation();
    const user = queryClient.getQueryData<UserResponse>([CURRENT_USER]);
    const allItems = sidebar.groups.flatMap((group) => group.items);
    const activeItem =
        allItems.find((item) => location.pathname === item.url) ||
        allItems
            .filter((item) => item.url !== '/' && location.pathname.startsWith(`${item.url}/`))
            .sort((a, b) => b.url.length - a.url.length)[0];
    const ActiveIcon = activeItem?.icon;
    return (
        <SidebarProvider className="min-h-svh w-full">
            <AppSidebar {...sidebar} />

            <div className="flex min-h-svh min-w-0 flex-1 flex-col bg-[#e9e9f1]">
                <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-[#d0d0dc] px-4">
                    <div className="flex min-w-0 flex-1 items-center">
                        <SidebarTrigger className="mr-3 shrink-0 text-[#666679] hover:bg-[#d9d9e3] hover:text-[#3f3f52]" />

                        <div className="h-5 w-px shrink-0 bg-[#d0d0dc]" />

                        <div className="ml-4 flex min-w-0 items-center gap-2">
                            {ActiveIcon && (
                                <ActiveIcon
                                    className="size-[17px] shrink-0 text-[#4a4a5e]"
                                    strokeWidth={2.25}
                                />
                            )}

                            <h1 className="truncate text-[15px] font-semibold tracking-tight text-[#343447]">
                                {activeItem?.title ?? 'Dashboard'}
                            </h1>
                        </div>
                    </div>

                    {user && (
                        <div className="flex shrink-0 items-center gap-2.5 rounded-xl bg-[#dedee8] px-2.5 pr-3">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#cfcfdd]">
                                <UserCircle />
                            </div>

                            <div className="hidden leading-tight sm:block">
                                <p className="text-[11px] font-semibold text-[#343447]">
                                    {user.firstName} {user.lastName}
                                </p>

                                <p className="text-[10px] font-medium text-[#777789]">
                                    {sidebar.title}
                                </p>
                            </div>
                        </div>
                    )}
                </header>

                <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-[1%]">
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    );
}
