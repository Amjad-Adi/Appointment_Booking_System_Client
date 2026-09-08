import {
    LayoutDashboard,
    Users,
    Building2,
    BriefcaseBusiness,
    Settings,
    UserCircle,
    LogOut,
} from 'lucide-react';
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
} from '../../../../@/components/ui/sidebar';

const overviewItems = [
    {
        title: 'Dashboard',
        url: '/admin',
        icon: LayoutDashboard,
    },
];

const managementItems = [
    {
        title: 'Users',
        url: '/admin/users',
        icon: Users,
    },
    {
        title: 'Organizations',
        url: '/admin/organizations',
        icon: Building2,
    },
    {
        title: 'Services',
        url: '/admin/services',
        icon: BriefcaseBusiness,
    },
];

const systemItems = [
    {
        title: 'Settings',
        url: '/admin/settings',
        icon: Settings,
    },
];

export function AdminSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg">
                        A
                    </div>

                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-semibold">Admin Panel</span>
                        <span className="text-muted-foreground truncate text-xs">Management</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Overview</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {overviewItems.map((item) => (
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
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {managementItems.map((item) => (
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
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>System</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {systemItems.map((item) => (
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
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            render={
                                <NavLink
                                    to="/admin/profile"
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
                                <span className="truncate text-sm">Admin User</span>
                                <span className="text-muted-foreground truncate text-xs">
                                    admin@example.com
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
