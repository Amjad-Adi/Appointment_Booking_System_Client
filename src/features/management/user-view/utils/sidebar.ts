import {
    LayoutDashboard,
    BriefcaseBusiness,
    DoorOpen,
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
                title: 'Rooms',
                url: '/customer/rooms',
                icon: DoorOpen,
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
        ],
    },
    {
        label: 'Account',
        items: [
            {
                title: 'Invitations',
                url: '/customer/invitations',
                icon: Mail,
            },
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
