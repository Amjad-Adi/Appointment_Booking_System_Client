import {
    LayoutDashboard,
    BriefcaseBusiness,
    DoorOpen,
    CalendarCheck,
    Mail,
    User,
    Building2,
    Users,
    MailPlus,
    Settings,
} from 'lucide-react';

import type { SidebarGroup } from '../../../../components/sidebar/sidebar.types';
import { Role } from '../../../../models/enums/roles.ts';

export function getOrganizationSetupSidebarGroups(): SidebarGroup[] {
    return [
        {
            label: 'Main',
            items: [
                {
                    title: 'Dashboard',
                    url: '/organization',
                    icon: LayoutDashboard,
                },
                {
                    title: 'Create Organization',
                    url: '/organization/create',
                    icon: Building2,
                },
            ],
        },
        {
            label: 'Account',
            items: [
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

export function getOrganizationSidebarGroups(
    organizationUuid: string,
    role?: Role,
): SidebarGroup[] {
    const isWorker = role === Role.WORKER;
    const canManageInvitations = !isWorker;

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
                ...(!isWorker
                    ? [
                          {
                              title: 'Organization',
                              url: `/organization/organization-profile/${organizationUuid}`,
                              icon: Building2,
                          },
                      ]
                    : []),
                {
                    title: 'Customers',
                    url: '/organization/customers',
                    icon: Users,
                },
                ...(canManageInvitations
                    ? [
                          {
                              title: 'Customer Invitations',
                              url: '/organization/customer-invitations',
                              icon: MailPlus,
                          },
                      ]
                    : []),
            ],
        },
        {
            label: 'Account',
            items: [
                ...(canManageInvitations
                    ? [
                          {
                              title: 'Invitations',
                              url: '/organization/invitations',
                              icon: Mail,
                          },
                      ]
                    : []),
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
