import { LayoutDashboard, Users, Building2, BriefcaseBusiness, Settings } from 'lucide-react';

import type { SidebarGroup } from '../../../../components/sidebar/sidebar.types';

export const adminSidebarGroups: SidebarGroup[] = [
    {
        label: 'Overview',
        items: [
            {
                title: 'Dashboard',
                url: '/admin',
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: 'Management',
        items: [
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
        ],
    },
    {
        label: 'System',
        items: [
            {
                title: 'Settings',
                url: '/admin/settings',
                icon: Settings,
            },
        ],
    },
];
