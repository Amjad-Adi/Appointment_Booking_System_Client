import { Outlet } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';

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
    const user = queryClient.getQueryData<UserResponse>([CURRENT_USER]);

    return (
        <SidebarProvider>
            <div className="m-5 flex min-h-dvh w-full">
                <AppSidebar {...sidebar} />
                <SidebarTrigger />
                <div className="min-w-0 flex-1">
                    <header className="flex h-16 w-full items-center justify-between bg-slate-200 px-4">
                        <div className="flex items-center gap-2">
                            <p>Title</p>
                        </div>
                        <div>
                            {user && (
                                <p>
                                    {user.firstName} {user.lastName}
                                </p>
                            )}
                        </div>
                    </header>
                    <main className="w-full">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
