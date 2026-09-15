import {
    LayoutDashboard,
    BriefcaseBusiness,
    DoorOpen,
    CalendarCheck,
    Mail,
    Star,
    User,
    Settings,
} from 'lucide-react';

import type { SidebarGroup } from '../../../../components/sidebar/sidebar.types';

export const organizationSidebarGroups: SidebarGroup[] = [
    {
        label: 'Main',
        items: [
            {
                title: 'Dashboard',
                url: '/organization',
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: 'Management',
        items: [
            {
                title: 'Services',
                url: '/organization/services',
                icon: BriefcaseBusiness,
            },
            {
                title: 'Rooms',
                url: '/organization/rooms',
                icon: DoorOpen,
            },
            {
                title: 'Appointments',
                url: '/organization/appointments',
                icon: CalendarCheck,
            },
        ],
    },
    {
        label: 'Account',
        items: [
            {
                title: 'Invitations',
                url: '/organization/invitations',
                icon: Mail,
            },
            {
                title: 'Reviews',
                url: '/organization/reviews',
                icon: Star,
            },
            {
                title: 'Profile',
                url: '/organization/profile',
                icon: User,
            },
            {
                title: 'Settings',
                url: '/organization/settings',
                icon: Settings,
            },
        ],
    },
];
