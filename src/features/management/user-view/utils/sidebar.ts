import {
    LayoutDashboard,
    BriefcaseBusiness,
    CalendarCheck,
    Mail,
    Heart,
    Star,
    User,
    Settings,
} from 'lucide-react';

import type { SidebarGroup } from '../../../../components/sidebar/sidebar.types';

export const userSidebarGroups: SidebarGroup[] = [
    {
        label: 'Main',
        items: [
            {
                title: 'Dashboard',
                url: '/user',
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: 'Services',
        items: [
            {
                title: 'Services',
                url: '/user/services',
                icon: BriefcaseBusiness,
            },
            {
                title: 'Booked Appointments',
                url: '/user/appointments',
                icon: CalendarCheck,
            },
            {
                title: 'Favourites',
                url: '/user/favourites',
                icon: Heart,
            },
            {
                title: 'Reviews',
                url: '/user/reviews',
                icon: Star,
            },
        ],
    },
    {
        label: 'Account',
        items: [
            {
                title: 'Invitations',
                url: '/user/invitations',
                icon: Mail,
            },
            {
                title: 'Profile',
                url: '/user/profile',
                icon: User,
            },
            {
                title: 'Settings',
                url: '/user/settings',
                icon: Settings,
            },
        ],
    },
];
