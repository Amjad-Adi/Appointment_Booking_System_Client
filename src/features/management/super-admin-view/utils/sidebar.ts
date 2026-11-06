import {
    LayoutDashboard,
    Users,
    Building2,
    BriefcaseBusiness,
    Tags,
    User,
    Settings,
} from 'lucide-react';

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
            {
                title: 'Service Categories',
                url: '/admin/service-categories',
                icon: Tags,
            },
        ],
    },
    {
        label: 'Account',
        items: [
            {
                title: 'Profile',
                url: '/admin/profile',
                icon: User,
            },
            {
                title: 'Settings',
                url: '/admin/settings',
                icon: Settings,
            },
        ],
    },
];
