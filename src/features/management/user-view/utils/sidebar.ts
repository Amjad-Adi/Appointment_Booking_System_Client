import {
    LayoutDashboard,
    BriefcaseBusiness,
    CalendarCheck,
    User,
    Heart,
    Star,
    Mail,
    Settings,
} from 'lucide-react';

import type { SidebarGroup } from '../../../../components/sidebar/sidebar.types';

export const userSidebarGroups: SidebarGroup[] = [
    {
        label: 'Main',
        items: [
            {
                title: 'Dashboard',
                url: '/customer',
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: 'Services',
        items: [
            {
                title: 'Services',
                url: '/customer/services',
                icon: BriefcaseBusiness,
            },
            {
                title: 'Booked Appointments',
                url: '/customer/appointments',
                icon: CalendarCheck,
            },
            {
                title: 'Favourites',
                url: '/customer/favourites',
                icon: Heart,
            },
            {
                title: 'Reviews',
                url: '/customer/reviews',
                icon: Star,
            },
            {
                title: 'Invitations',
                url: '/customer/invitations',
                icon: Mail,
            },
        ],
    },
    {
        label: 'Account',
        items: [
            {
                title: 'Profile',
                url: '/customer/profile',
                icon: User,
            },
            {
                title: 'Settings',
                url: '/customer/settings',
                icon: Settings,
            },
        ],
    },
];
