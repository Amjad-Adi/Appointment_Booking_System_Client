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


export function getOrganizationSidebarGroups(organizationUuid: string): SidebarGroup[] {
    return [
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
                {
                    title: 'Organization',
                    url: `/organization/organization-profile/${organizationUuid}`,
                    icon: BriefcaseBusiness,
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
}
