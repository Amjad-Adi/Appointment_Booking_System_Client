import { LogOut, UserCircle } from 'lucide-react';
import { NavLink } from 'react-router';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '../../../@/components/ui/sidebar';

import type { SidebarProps } from './sidebar.types';
import toast from 'react-hot-toast';
import { useLogout } from '../../features/management/hooks/users-hook.ts';
import { Toast } from '../../utlis/toast.ts';

const loading = 'Logout user...';
const success = 'User logged out successfully';
const error = 'Failed to logout user';

export function AppSidebar({ title, subtitle, logo, groups, profile }: SidebarProps) {
    const logoutMutation = useLogout();
    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-3">
                    {logo && (
                        <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg">
                            {logo}
                        </div>
                    )}
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-semibold">{title}</span>
                        {subtitle && (
                            <span className="text-muted-foreground truncate text-xs">
                                {subtitle}
                            </span>
                        )}
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {groups.map((group) => (
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                render={
                                                    <NavLink
                                                        to={item.url}
                                                        className={({ isActive }) =>
                                                            isActive
                                                                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                                                : ''
                                                        }
                                                    />
                                                }
                                            >
                                                <Icon />
                                                <span>{item.title}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            {profile && (
                <SidebarFooter className="p-2">
                    <SidebarMenu>
                        {profile && (
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    render={
                                        <NavLink
                                            to={profile.url}
                                            className={({ isActive }) =>
                                                isActive
                                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                                    : ''
                                            }
                                        />
                                    }
                                >
                                    <UserCircle />

                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <span className="truncate text-sm">{profile.name}</span>

                                        <span className="text-muted-foreground truncate text-xs">
                                            {profile.email}
                                        </span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={handleLogout}>
                                <LogOut />
                                <span>Logout</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            )}
        </Sidebar>
    );

    async function handleLogout() {
        await toast.promise(logoutMutation.mutateAsync(), new Toast(loading, success, error));
    }
}
