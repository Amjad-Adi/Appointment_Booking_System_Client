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
        <Sidebar collapsible="icon" className="border-r-0 bg-[#dedee8]">
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#cfcfdd]">
                        <Image
                            src={icon}
                            alt="Smart Appointment Booking icon"
                            className="h-full w-full rounded-full object-cover"
                        />
                    </div>

                    <div className="flex min-w-0 flex-col gap-0 group-data-[collapsible=icon]:hidden">
                        <span className="truncate text-[13px] leading-tight font-semibold text-[#343447]">
                            {title}
                        </span>

                        {subtitle && (
                            <span className="truncate text-[11px] leading-tight font-medium text-[#777789]">
                                {subtitle}
                            </span>
                        )}
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {groups.map((group, index) => (
                    <div key={group.label}>
                        {index > 0 && <div className="mx-4 my-2 h-px bg-[#c9c9d6]" />}

                        <SidebarGroup>
                            <SidebarGroupLabel className="text-[10px] font-semibold tracking-wide text-[#777789] uppercase group-data-[collapsible=icon]:opacity-0">
                                {group.label}
                            </SidebarGroupLabel>

                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {group.items.map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    className="rounded-xl text-[#555566] transition-colors duration-150 hover:bg-[#d8d8e3] hover:text-[#343447]"
                                                    render={
                                                        <NavLink
                                                            to={item.url}
                                                            className={({ isActive }) =>
                                                                isActive
                                                                    ? 'bg-[#d3d3df] text-[#343447]'
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
                                className="rounded-xl text-[#555566] transition-colors duration-150 hover:bg-[#d8d8e3] hover:text-[#343447]"
                                render={
                                    <NavLink
                                        to={profile.url}
                                        className={({ isActive }) =>
                                            isActive ? 'bg-[#d3d3df] text-[#343447]' : ''
                                        }
                                    >
                                        <UserCircle />

                                        <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
                                            <span className="truncate text-[11px] font-semibold text-[#343447]">
                                                {profile.name}
                                            </span>

                                            <span className="truncate text-[10px] font-medium text-[#777789]">
                                                {profile.email}
                                            </span>
                                        </div>
                                    </NavLink>
                                }
                            />
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                className="rounded-xl text-[#555566] transition-colors duration-150 hover:bg-[#d8d8e3] hover:text-[#343447]"
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
        await toast.promise(logoutMutation.mutateAsync(), new Toast(loading, success, error));
    }
}
