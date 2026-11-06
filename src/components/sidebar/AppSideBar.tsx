import { LogOut, UserCircle } from 'lucide-react';
import { NavLink } from 'react-router';
import toast from 'react-hot-toast';

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
import { useLogout } from '../../features/management/hooks/users-hook.ts';
import { Toast } from '../../utlis/toast.ts';
import icon from '../../assets/images/icons/icon.png';
import { Image } from '../Image.tsx';

const loading = 'Logout user...';
const success = 'User logged out successfully';
const error = 'Failed to logout user';

export function AppSidebar({ title, subtitle, groups, profile }: SidebarProps) {
    const logoutMutation = useLogout();

    return (
        <Sidebar collapsible="icon" className="border-r-0 bg-sidebar">
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sidebar-accent">
                        <Image
                            src={icon}
                            alt="Smart Appointment Booking icon"
                            className="h-full w-full rounded-full object-cover"
                        />
                    </div>

                    <div className="flex min-w-0 flex-col gap-0 group-data-[collapsible=icon]:hidden">
                        <span className="truncate text-[13px] leading-tight font-semibold text-sidebar-foreground">
                            {title}
                        </span>

                        {subtitle && (
                            <span className="truncate text-left text-[11px] font-medium text-muted-foreground">
                                {subtitle}
                            </span>
                        )}
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {groups.map((group, index) => (
                    <div key={group.label}>
                        {index > 0 && <div className="mx-4 my-2 h-px bg-sidebar-border" />}

                        <SidebarGroup>
                            <SidebarGroupLabel className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase group-data-[collapsible=icon]:opacity-0">
                                {group.label}
                            </SidebarGroupLabel>

                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {group.items.map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    className="rounded-xl text-sidebar-foreground/80 transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                                    render={
                                                        <NavLink
                                                            to={item.url}
                                                            className={({ isActive }) =>
                                                                isActive
                                                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                                                    : ''
                                                            }
                                                        >
                                                            <Icon />

                                                            <span className="text-[12px] group-data-[collapsible=icon]:hidden">
                                                                {item.title}
                                                            </span>
                                                        </NavLink>
                                                    }
                                                />
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </div>
                ))}
            </SidebarContent>

            {profile && (
                <SidebarFooter className="p-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                className="rounded-xl text-sidebar-foreground/80 transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                render={
                                    <NavLink
                                        to={profile.url}
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                                : ''
                                        }
                                    >
                                        <UserCircle />

                                        <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
                                            <span className="truncate text-[11px] font-semibold text-sidebar-foreground">
                                                {profile.name}
                                            </span>

                                            <span className="truncate text-[10px] font-medium text-muted-foreground">
                                                {profile.email}
                                            </span>
                                        </div>
                                    </NavLink>
                                }
                            />
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                className="rounded-xl text-sidebar-foreground/80 transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                onClick={handleLogout}
                            >
                                <LogOut />

                                <span className="text-[12px] group-data-[collapsible=icon]:hidden">
                                    Logout
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            )}
        </Sidebar>
    );

    async function handleLogout() {
        try {
            await toast.promise(logoutMutation.mutateAsync(), new Toast(loading, success, error));
        } catch {
            // toast.promise already surfaced the error.
        }
    }
}
