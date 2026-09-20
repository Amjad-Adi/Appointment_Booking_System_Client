import { createBrowserRouter, Navigate } from 'react-router';

import { Login } from '../features/auth/pages/login/Login.tsx';
import { Register } from '../features/auth/pages/register/Register.tsx';
import { AuthLayout } from '../features/auth/layouts/Auth.tsx';

import { NotFoundPage } from '../features/NotFoundPage.tsx';

// Public
// Super Admin
import { SuperAdminLayout } from '../features/management/super-admin-view/layout/SuperAdminLayout.tsx';
import { SuperAdminUsersPage } from '../features/management/super-admin-view/pages/users/users/UsersPage.tsx';
import { UserProfilePage } from '../features/management/super-admin-view/pages/users/users-profile/UserProfilePage.tsx';
import { SuperAdminOrganizationsPage } from '../features/management/super-admin-view/pages/organizations/OrganizationsPage.tsx';
import { OrganizationProfilePage } from '../features/management/super-admin-view/pages/organizations/organization-profile/OrganizationProfilePage.tsx';

// User / Organization
import { UserLayout } from '../features/management/user-view/layout/UserLayout.tsx';
import { OrganizationLayout } from '../features/management/organizations/layout/OrganizationLayout.tsx';
import { ProfilePage } from '../features/management/user-view/pages/user-profile/ProfilePage.tsx';
import { ServicesPage } from '../features/management/user-view/pages/services/ServicePage.tsx';
import { ServiceProfilePage } from '../features/management/user-view/pages/service-profile/ServiceProfilePage.tsx';
import { RoomPage } from '../features/management/user-view/pages/rooms/RoomPage.tsx';
import { RoomProfilePage } from '../features/management/user-view/pages/rooms-profile/RoomProfilePage.tsx';
import { AppointmentPage } from '../features/management/appointments/AppointmentPage.tsx';
import { AppointmentProfilePage } from '../features/management/appointments/appointment-profile/AppointmentProfilePage.tsx';
import { InvitationPage } from '../features/management/super-admin-view/pages/organizations/invitations/InvitationPage.tsx';

import { RoleBasedRouter } from './RoleBasedRouter.tsx';

import {
    HAS_LOGIN,
    SUPER_ADMIN_ACCESS,
    SUPER_ADMIN_USER_MANAGEMENT_PAGE,
    SUPER_ADMIN_ORGANIZATIONS_MANAGEMENT_PAGE,
    SUPER_ADMIN_SERVICE_CATEGORIES_MANAGEMENT_PAGE,
    USER_DASHBOARD_PAGE,
    USER_SERVICES_PAGE,
    USER_ROOMS_PAGE,
    USER_APPOINTMENTS_PAGE,
    USER_INVITATIONS_PAGE,
    USER_PROFILE_PAGE,
    ORGANIZATION_MANAGEMENT_PAGE,
} from '../permissions/permissions.ts';
import { AcceptInvitationPage } from '../features/management/public/invitations/AcceptInvitationPage.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        children: [
            // ==================================================
            // Authentication
            // ==================================================
            {
                element: <AuthLayout />,
                children: [
                    { path: 'login', element: <Login /> },
                    { path: 'register', element: <Register /> },
                ],
            },

            // ==================================================
            // Public Routes
            // ==================================================
            {
                path: 'invitations',
                children: [
                    {
                        path: 'accept',
                        element: <AcceptInvitationPage />,
                    },
                ],
            },

            // ==================================================
            // Super Admin
            // ==================================================
            {
                element: (
                    <RoleBasedRouter permission={SUPER_ADMIN_ACCESS}>
                        <SuperAdminLayout />
                    </RoleBasedRouter>
                ),
                children: [
                    {
                        path: 'admin',
                        children: [
                            {
                                index: true,
                                element: <Navigate to="users" replace />,
                            },
                            {
                                path: 'users',
                                children: [
                                    {
                                        index: true,
                                        element: (
                                            <RoleBasedRouter
                                                permission={SUPER_ADMIN_USER_MANAGEMENT_PAGE}
                                            >
                                                <SuperAdminUsersPage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                    {
                                        path: ':userUuid/:mode?',
                                        element: (
                                            <RoleBasedRouter
                                                permission={SUPER_ADMIN_USER_MANAGEMENT_PAGE}
                                            >
                                                <UserProfilePage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                ],
                            },
                            {
                                path: 'organizations',
                                children: [
                                    {
                                        index: true,
                                        element: (
                                            <RoleBasedRouter
                                                permission={
                                                    SUPER_ADMIN_ORGANIZATIONS_MANAGEMENT_PAGE
                                                }
                                            >
                                                <SuperAdminOrganizationsPage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                    {
                                        path: ':organizationUuid/:mode?',
                                        element: (
                                            <RoleBasedRouter
                                                permission={
                                                    SUPER_ADMIN_ORGANIZATIONS_MANAGEMENT_PAGE
                                                }
                                            >
                                                <OrganizationProfilePage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                ],
                            },
                            {
                                path: 'service-categories',
                                element: (
                                    <RoleBasedRouter
                                        permission={SUPER_ADMIN_SERVICE_CATEGORIES_MANAGEMENT_PAGE}
                                    >
                                        <div>Super Admin Service Categories</div>
                                    </RoleBasedRouter>
                                ),
                            },
                        ],
                    },
                ],
            },

            // ==================================================
            // Organization
            // ==================================================
            {
                element: (
                    <RoleBasedRouter permission={HAS_LOGIN}>
                        <OrganizationLayout />
                    </RoleBasedRouter>
                ),
                children: [
                    {
                        path: 'organization',
                        children: [
                            {
                                index: true,
                                element: (
                                    <RoleBasedRouter permission={USER_DASHBOARD_PAGE}>
                                        <div>hi</div>
                                    </RoleBasedRouter>
                                ),
                            },
                            {
                                path: 'services',
                                children: [
                                    {
                                        index: true,
                                        element: (
                                            <RoleBasedRouter permission={USER_SERVICES_PAGE}>
                                                <ServicesPage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                    {
                                        path: ':serviceUuid',
                                        element: (
                                            <RoleBasedRouter permission={USER_SERVICES_PAGE}>
                                                <ServiceProfilePage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                ],
                            },
                            {
                                path: 'rooms',
                                children: [
                                    {
                                        index: true,
                                        element: (
                                            <RoleBasedRouter permission={USER_ROOMS_PAGE}>
                                                <RoomPage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                    {
                                        path: ':roomUuid',
                                        element: (
                                            <RoleBasedRouter permission={USER_ROOMS_PAGE}>
                                                <RoomProfilePage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                ],
                            },
                            {
                                path: 'appointments',
                                children: [
                                    {
                                        index: true,
                                        element: (
                                            <RoleBasedRouter permission={USER_APPOINTMENTS_PAGE}>
                                                <AppointmentPage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                    {
                                        path: ':appointmentUuid',
                                        element: (
                                            <RoleBasedRouter permission={USER_APPOINTMENTS_PAGE}>
                                                <AppointmentProfilePage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                ],
                            },
                            {
                                path: 'organization-profile/:organizationUuid/:mode?',
                                element: (
                                    <RoleBasedRouter permission={ORGANIZATION_MANAGEMENT_PAGE}>
                                        <OrganizationProfilePage />
                                    </RoleBasedRouter>
                                ),
                            },
                            {
                                path: 'invitations',
                                children: [
                                    {
                                        index: true,
                                        element: (
                                            <RoleBasedRouter permission={USER_INVITATIONS_PAGE}>
                                                <InvitationPage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                ],
                            },
                            {
                                path: 'profile/:mode?',
                                element: (
                                    <RoleBasedRouter permission={USER_PROFILE_PAGE}>
                                        <ProfilePage />
                                    </RoleBasedRouter>
                                ),
                            },
                        ],
                    },
                ],
            },

            // ==================================================
            // Customer
            // ==================================================
            {
                element: (
                    <RoleBasedRouter permission={HAS_LOGIN}>
                        <UserLayout />
                    </RoleBasedRouter>
                ),
                children: [
                    {
                        path: 'customer',
                        children: [
                            {
                                index: true,
                                element: (
                                    <RoleBasedRouter permission={USER_DASHBOARD_PAGE}>
                                        <div>Customer Dashboard</div>
                                    </RoleBasedRouter>
                                ),
                            },
                            {
                                path: 'services',
                                children: [
                                    {
                                        index: true,
                                        element: (
                                            <RoleBasedRouter permission={USER_SERVICES_PAGE}>
                                                <ServicesPage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                    {
                                        path: ':serviceUuid',
                                        element: (
                                            <RoleBasedRouter permission={USER_SERVICES_PAGE}>
                                                <ServiceProfilePage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                ],
                            },
                            {
                                path: 'rooms',
                                children: [
                                    {
                                        index: true,
                                        element: (
                                            <RoleBasedRouter permission={USER_ROOMS_PAGE}>
                                                <RoomPage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                    {
                                        path: ':roomUuid',
                                        element: (
                                            <RoleBasedRouter permission={USER_ROOMS_PAGE}>
                                                <RoomProfilePage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                ],
                            },
                            {
                                path: 'appointments',
                                children: [
                                    {
                                        index: true,
                                        element: (
                                            <RoleBasedRouter permission={USER_APPOINTMENTS_PAGE}>
                                                <div>Customer Appointments</div>
                                            </RoleBasedRouter>
                                        ),
                                    },
                                    {
                                        path: ':appointmentUuid',
                                        element: (
                                            <RoleBasedRouter permission={USER_APPOINTMENTS_PAGE}>
                                                <div>Customer Appointment</div>
                                            </RoleBasedRouter>
                                        ),
                                    },
                                ],
                            },
                            {
                                path: 'profile/:mode?',
                                element: (
                                    <RoleBasedRouter permission={USER_PROFILE_PAGE}>
                                        <ProfilePage />
                                    </RoleBasedRouter>
                                ),
                            },
                        ],
                    },
                ],
            },

            // ==================================================
            // Not Found
            // ==================================================
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
]);
