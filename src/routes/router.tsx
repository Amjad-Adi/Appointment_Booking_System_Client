import { createBrowserRouter, Navigate } from 'react-router';

import { Login } from '../features/auth/pages/login/Login.tsx';
import { Register } from '../features/auth/pages/register/Register.tsx';
import { AuthLayout } from '../features/auth/layouts/Auth.tsx';

import { ErrorPage } from '../features/ErrorPage.tsx';

// Super Admin
import { SuperAdminLayout } from '../features/management/super-admin-view/layout/SuperAdminLayout.tsx';
import { SuperAdminDashboardPage } from '../features/management/super-admin-view/pages/dashboard/SuperAdminDashboardPage.tsx';
import { SuperAdminUsersPage } from '../features/management/super-admin-view/pages/users/users/UsersPage.tsx';
import { UserProfilePage } from '../features/management/super-admin-view/pages/users/users-profile/UserProfilePage.tsx';
import { SuperAdminOrganizationsPage } from '../features/management/super-admin-view/pages/organizations/OrganizationsPage.tsx';
import { OrganizationProfilePage } from '../features/management/super-admin-view/pages/organizations/organization-profile/OrganizationProfilePage.tsx';
import { ServiceCategoriesPage } from '../features/management/super-admin-view/pages/service-categories/ServiceCategoriesPage.tsx';

// Organization
import { OrganizationLayout } from '../features/management/organizations/layout/OrganizationLayout.tsx';
import { OrganizationDashboardPage } from '../features/management/dashboard/OrganizationDashboardPage.tsx';
import { CreateOrganizationPage } from '../features/management/super-admin-view/pages/organizations/organizations/components/create-organization/CreateOrganizationPage.tsx';

// User
import { UserLayout } from '../features/management/user-view/layout/UserLayout.tsx';
import { CustomerDashboardPage } from '../features/management/user-view/pages/dashboard/CustomerDashboardPage.tsx';
import { CustomerAppointmentsPage } from '../features/management/user-view/pages/appointments/CustomerAppointmentsPage.tsx';
import { CustomerBookingPage } from '../features/management/user-view/pages/booking/CustomerBookingPage.tsx';
import { ProfilePage } from '../features/management/user-view/pages/user-profile/ProfilePage.tsx';
import { ServicesPage } from '../features/management/user-view/pages/services/ServicePage.tsx';
import { ServiceProfilePage } from '../features/management/user-view/pages/service-profile/ServiceProfilePage.tsx';
import { RoomPage } from '../features/management/user-view/pages/rooms/RoomPage.tsx';
import { RoomProfilePage } from '../features/management/user-view/pages/rooms-profile/RoomProfilePage.tsx';
import { AppointmentPage } from '../features/management/appointments/AppointmentPage.tsx';
import { AppointmentProfilePage } from '../features/management/appointments/appointment-profile/AppointmentProfilePage.tsx';
import { FavouritesPage } from '../features/management/user-view/pages/favourites/FavouritesPage.tsx';
import { ReviewsPage } from '../features/management/user-view/pages/reviews/ReviewsPage.tsx';
import { CustomerInvitationsPage } from '../features/management/user-view/pages/invitations/CustomerInvitationsPage.tsx';
import { UserSettingsPage } from '../features/management/pages/UserSettingsPage.tsx';
import { OrganizationCustomersPage } from '../features/management/organizations/pages/customers/OrganizationCustomersPage.tsx';
import { OrganizationCustomerInvitationsPage } from '../features/management/organizations/pages/customer-invitations/OrganizationCustomerInvitationsPage.tsx';

// Invitations
import { InvitationPage } from '../features/management/super-admin-view/pages/organizations/invitations/InvitationPage.tsx';
import { AcceptInvitationPage } from '../features/management/public/invitations/AcceptInvitationPage.tsx';

import { RoleBasedRouter } from './RoleBasedRouter.tsx';

import {
    HAS_LOGIN,
    SUPER_ADMIN_ACCESS,
    SUPER_ADMIN_DASHBOARD_PAGE,
    SUPER_ADMIN_USER_MANAGEMENT_PAGE,
    SUPER_ADMIN_ORGANIZATIONS_MANAGEMENT_PAGE,
    SUPER_ADMIN_SERVICE_CATEGORIES_MANAGEMENT_PAGE,
    SUPER_ADMIN_SERVICES_PAGE,
    ORGANIZATION_DASHBOARD_PAGE,
    ORGANIZATION_CREATE_PAGE,
    CUSTOMER_DASHBOARD_PAGE,
    ORGANIZATION_MANAGEMENT_PAGE,
    USER_SERVICES_PAGE,
    USER_ROOMS_PAGE,
    USER_APPOINTMENTS_PAGE,
    USER_PROFILE_PAGE,
    USER_SETTINGS_PAGE,
    USER_FAVOURITES_PAGE,
    USER_REVIEWS_PAGE,
    USER_INVITATIONS_PAGE,
    ORGANIZATION_INVITATION_PAGE,
    ORGANIZATION_CUSTOMERS_PAGE,
    ORGANIZATION_CUSTOMER_INVITATIONS_PAGE,
} from '../permissions/permissions.ts';

export const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <ErrorPage />,
        children: [
            // ==================================================
            // First Page
            // ==================================================
            {
                index: true,
                element: <Navigate to="/login" replace />,
            },

            // ==================================================
            // Authentication
            // ==================================================
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: 'login',
                        element: <Login />,
                    },
                    {
                        path: 'register',
                        element: <Register />,
                    },
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
                                element: (
                                    <RoleBasedRouter permission={SUPER_ADMIN_DASHBOARD_PAGE}>
                                        <SuperAdminDashboardPage />
                                    </RoleBasedRouter>
                                ),
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
                                path: 'services',
                                children: [
                                    {
                                        index: true,
                                        element: (
                                            <RoleBasedRouter permission={SUPER_ADMIN_SERVICES_PAGE}>
                                                <ServicesPage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                    {
                                        path: ':serviceUuid',
                                        element: (
                                            <RoleBasedRouter permission={SUPER_ADMIN_SERVICES_PAGE}>
                                                <ServiceProfilePage />
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
                                        <ServiceCategoriesPage />
                                    </RoleBasedRouter>
                                ),
                            },
                            {
                                path: 'settings',
                                element: (
                                    <RoleBasedRouter permission={USER_SETTINGS_PAGE}>
                                        <UserSettingsPage title="Administrator Settings" />
                                    </RoleBasedRouter>
                                ),
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
                            // ------------------------------
                            // Dashboard (all organization roles)
                            // ------------------------------
                            {
                                index: true,
                                element: (
                                    <RoleBasedRouter permission={ORGANIZATION_DASHBOARD_PAGE}>
                                        <OrganizationDashboardPage />
                                    </RoleBasedRouter>
                                ),
                            },

                            // ------------------------------
                            // Owner: create the organization
                            // ------------------------------
                            {
                                path: 'create',
                                element: (
                                    <RoleBasedRouter permission={ORGANIZATION_CREATE_PAGE}>
                                        <CreateOrganizationPage />
                                    </RoleBasedRouter>
                                ),
                            },

                            // Legacy role dashboard paths
                            {
                                path: 'owner',
                                element: <Navigate to="/organization" replace />,
                            },
                            {
                                path: 'manager',
                                element: <Navigate to="/organization" replace />,
                            },
                            {
                                path: 'crm',
                                element: <Navigate to="/organization" replace />,
                            },
                            {
                                path: 'worker',
                                element: <Navigate to="/organization" replace />,
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
                                            <RoleBasedRouter permission={USER_ROOMS_PAGE}>
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

                            // ------------------------------
                            // Organization Profile
                            // ------------------------------
                            {
                                path: 'organization-profile/:organizationUuid/:mode?',
                                element: (
                                    <RoleBasedRouter permission={ORGANIZATION_MANAGEMENT_PAGE}>
                                        <OrganizationProfilePage />
                                    </RoleBasedRouter>
                                ),
                            },

                            // ------------------------------
                            // Organization Invitations
                            // ------------------------------
                            {
                                path: 'invitations',
                                element: (
                                    <RoleBasedRouter permission={ORGANIZATION_INVITATION_PAGE}>
                                        <InvitationPage />
                                    </RoleBasedRouter>
                                ),
                            },

                            // ------------------------------
                            // Customers
                            // ------------------------------
                            {
                                path: 'customers',
                                element: (
                                    <RoleBasedRouter permission={ORGANIZATION_CUSTOMERS_PAGE}>
                                        <OrganizationCustomersPage />
                                    </RoleBasedRouter>
                                ),
                            },
                            {
                                path: 'customer-invitations',
                                element: (
                                    <RoleBasedRouter
                                        permission={ORGANIZATION_CUSTOMER_INVITATIONS_PAGE}
                                    >
                                        <OrganizationCustomerInvitationsPage />
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
                                        <UserSettingsPage title="Organization Settings" />
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
                            // Customer Dashboard
                            // ------------------------------
                            {
                                index: true,
                                element: (
                                    <RoleBasedRouter permission={CUSTOMER_DASHBOARD_PAGE}>
                                        <CustomerDashboardPage />
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
                                    {
                                        path: ':serviceUuid/book',
                                        element: (
                                            <RoleBasedRouter permission={USER_SERVICES_PAGE}>
                                                <CustomerBookingPage />
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
                                children: [
                                    {
                                        index: true,
                                        element: (
                                            <RoleBasedRouter permission={USER_APPOINTMENTS_PAGE}>
                                                <CustomerAppointmentsPage />
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

                            // ------------------------------
                            // Favourites
                            // ------------------------------
                            {
                                path: 'favourites',
                                element: (
                                    <RoleBasedRouter permission={USER_FAVOURITES_PAGE}>
                                        <FavouritesPage />
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
                                        <ReviewsPage />
                                    </RoleBasedRouter>
                                ),
                            },

                            // ------------------------------
                            // Invitations received from organizations
                            // ------------------------------
                            {
                                path: 'invitations',
                                element: (
                                    <RoleBasedRouter permission={USER_INVITATIONS_PAGE}>
                                        <CustomerInvitationsPage />
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
                                        <UserSettingsPage />
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
                        ],
                    },
                ],
            },

            // ==================================================
            // Not Found
            // ==================================================
            {
                path: '*',
                loader: () => {
                    throw new Response(
                        'The page you are looking for does not exist or has moved.',
                        { status: 404 },
                    );
                },
            },
        ],
    },
]);
