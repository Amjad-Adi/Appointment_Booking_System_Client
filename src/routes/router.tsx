import { createBrowserRouter, Navigate } from 'react-router';

import { Login } from '../features/auth/pages/login/Login.tsx';
import { AuthLayout } from '../features/auth/layouts/Auth.tsx';
import { Register } from '../features/auth/pages/register/Register.tsx';

// Super Admin pages
import { SuperAdminUsersPage } from '../features/management/super-admin-view/pages/users/users/UsersPage.tsx';
import { SuperAdminOrganizationsPage } from '../features/management/super-admin-view/pages/organizations/OrganizationsPage.tsx';
import { SuperAdminLayout } from '../features/management/super-admin-view/layout/SuperAdminLayout.tsx';
import { UserProfilePage } from '../features/management/super-admin-view/pages/users/users-profile/UserProfilePage.tsx';
import { OrganizationProfilePage } from '../features/management/super-admin-view/pages/organizations/organization-profile/OrganizationProfilePage.tsx';

// User pages
import { ProfilePage } from '../features/management/user-view/pages/user-profile/ProfilePage.tsx';
import { ServicesPage } from '../features/management/user-view/pages/services/ServicePage.tsx';
import { ServiceProfilePage } from '../features/management/user-view/pages/service-profile/ServiceProfilePage.tsx';
import { RoomPage } from '../features/management/user-view/pages/rooms/RoomPage.tsx';

import { UserLayout } from '../features/management/user-view/layout/UserLayout.tsx';

import { RoleBasedRouter } from './RoleBasedRouter.tsx';

import {
    HAS_LOGIN,

    // Super Admin
    SUPER_ADMIN_ACCESS,
    SUPER_ADMIN_ORGANIZATIONS_MANAGEMENT_PAGE,
    SUPER_ADMIN_USER_MANAGEMENT_PAGE,
    SUPER_ADMIN_SERVICE_CATEGORIES_MANAGEMENT_PAGE,

    // User pages
    USER_DASHBOARD_PAGE,
    USER_SERVICES_PAGE,
    USER_ROOMS_PAGE,
    USER_APPOINTMENTS_PAGE,
    USER_INVITATIONS_PAGE,
    USER_FAVOURITES_PAGE,
    USER_REVIEWS_PAGE,
    USER_PROFILE_PAGE,
    USER_SETTINGS_PAGE,
} from '../permissions/permissions.ts';

import { NotFoundPage } from '../features/NotFoundPage.tsx';
import { RoomProfilePage } from '../features/management/user-view/pages/rooms-profile/RoomProfilePage.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        children: [
            // ==================================================
            // Authentication
            // ==================================================
            {
                Component: AuthLayout,
                children: [
                    {
                        path: 'login',
                        Component: Login,
                    },
                    {
                        path: 'register',
                        Component: Register,
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

                            // ------------------------------
                            // Users
                            // ------------------------------
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

                            // ------------------------------
                            // Organizations
                            // ------------------------------
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

                            // ------------------------------
                            // Service Categories
                            // ------------------------------
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

                            // ------------------------------
                            // Services
                            // ------------------------------
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
                        ],
                    },
                ],
            },

            // ==================================================
            // Organization Users
            //
            // OWNER + MANAGER + WORKER + CRM
            // ==================================================
            {
                element: (
                    <RoleBasedRouter permission={HAS_LOGIN}>
                        <UserLayout />
                    </RoleBasedRouter>
                ),
                children: [
                    {
                        path: 'organization',
                        children: [
                            // ------------------------------
                            // Dashboard
                            // ------------------------------
                            {
                                index: true,
                                element: (
                                    <RoleBasedRouter permission={USER_DASHBOARD_PAGE}>
                                        <div>Organization Dashboard</div>
                                    </RoleBasedRouter>
                                ),
                            },

                            // ------------------------------
                            // Services
                            // ------------------------------
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

                            // ------------------------------
                            // Rooms
                            // ------------------------------
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
                                ],
                            },

                            // ------------------------------
                            // Appointments
                            // ------------------------------
                            {
                                path: 'appointments',
                                element: (
                                    <RoleBasedRouter permission={USER_APPOINTMENTS_PAGE}>
                                        <div>Appointments</div>
                                    </RoleBasedRouter>
                                ),
                            },

                            // ------------------------------
                            // Invitations
                            // ------------------------------
                            {
                                path: 'invitations',
                                element: (
                                    <RoleBasedRouter permission={USER_INVITATIONS_PAGE}>
                                        <div>Invitations</div>
                                    </RoleBasedRouter>
                                ),
                            },

                            // ------------------------------
                            // Reviews
                            // ------------------------------
                            {
                                path: 'reviews',
                                element: (
                                    <RoleBasedRouter permission={USER_REVIEWS_PAGE}>
                                        <div>Reviews</div>
                                    </RoleBasedRouter>
                                ),
                            },

                            // ------------------------------
                            // Profile
                            // ------------------------------
                            {
                                path: 'profile/:mode?',
                                element: (
                                    <RoleBasedRouter permission={USER_PROFILE_PAGE}>
                                        <ProfilePage />
                                    </RoleBasedRouter>
                                ),
                            },

                            // ------------------------------
                            // Settings
                            // ------------------------------
                            {
                                path: 'settings',
                                element: (
                                    <RoleBasedRouter permission={USER_SETTINGS_PAGE}>
                                        <div>Settings</div>
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
                            // ------------------------------
                            // Dashboard
                            // ------------------------------
                            {
                                index: true,
                                element: (
                                    <RoleBasedRouter permission={USER_DASHBOARD_PAGE}>
                                        <div>Customer Dashboard</div>
                                    </RoleBasedRouter>
                                ),
                            },

                            // ------------------------------
                            // Services
                            // ------------------------------
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

                            // ------------------------------
                            // Rooms
                            // ------------------------------
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
                                            <RoleBasedRouter permission={USER_SERVICES_PAGE}>
                                                <RoomProfilePage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                ],
                            },

                            // ------------------------------
                            // Appointments
                            // ------------------------------
                            {
                                path: 'appointments',
                                element: (
                                    <RoleBasedRouter permission={USER_APPOINTMENTS_PAGE}>
                                        <div>Customer Appointments</div>
                                    </RoleBasedRouter>
                                ),
                            },

                            // ------------------------------
                            // Favourites
                            // ------------------------------
                            {
                                path: 'favourites',
                                element: (
                                    <RoleBasedRouter permission={USER_FAVOURITES_PAGE}>
                                        <div>Customer Favourites</div>
                                    </RoleBasedRouter>
                                ),
                            },

                            // ------------------------------
                            // Reviews
                            // ------------------------------
                            {
                                path: 'reviews',
                                element: (
                                    <RoleBasedRouter permission={USER_REVIEWS_PAGE}>
                                        <div>Customer Reviews</div>
                                    </RoleBasedRouter>
                                ),
                            },

                            // ------------------------------
                            // Profile
                            // ------------------------------
                            {
                                path: 'profile/:mode?',
                                element: (
                                    <RoleBasedRouter permission={USER_PROFILE_PAGE}>
                                        <ProfilePage />
                                    </RoleBasedRouter>
                                ),
                            },

                            // ------------------------------
                            // Settings
                            // ------------------------------
                            {
                                path: 'settings',
                                element: (
                                    <RoleBasedRouter permission={USER_SETTINGS_PAGE}>
                                        <div>Customer Settings</div>
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
                Component: NotFoundPage,
            },
        ],
    },
]);
