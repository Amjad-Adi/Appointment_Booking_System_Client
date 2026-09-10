import { createBrowserRouter } from 'react-router';

import { Login } from '../features/auth/pages/login/Login.tsx';
import { AuthLayout } from '../features/auth/layouts/Auth.tsx';
import { Register } from '../features/auth/pages/register/Register.tsx';

import { SuperAdminUsersPage } from '../features/management/super-admin-view/pages/users/users/UsersPage.tsx';
import { SuperAdminOrganizationsPage } from '../features/management/super-admin-view/pages/organizations/OrganizationsPage.tsx';

import { SuperAdminLayout } from '../features/management/super-admin-view/layout/SuperAdminLayout.tsx';

import { UserProfilePage } from '../features/management/super-admin-view/pages/users/users-profile/UserProfilePage.tsx';
import { OrganizationProfilePage } from '../features/management/super-admin-view/pages/organizations/organization-profile/OrganizationProfilePage.tsx';

import { RoleBasedRouter } from './RoleBasedRouter.tsx';

import {
    HAS_LOGIN,
    SUPER_ADMIN_ORGANIZATIONS_MANAGEMENT_PAGE,
    SUPER_ADMIN_USER_MANAGEMENT_PAGE,
} from '../permissions/permissions.ts';

import { NotFoundPage } from '../features/NotFoundPage.tsx';
import { ProfilePage } from '../features/management/user-view/pages/user-profile/ProfilePage.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        children: [
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

            {
                element: (
                    <RoleBasedRouter permission={HAS_LOGIN}>
                        <SuperAdminLayout />
                    </RoleBasedRouter>
                ),
                children: [
                    {
                        path: 'admin',
                        children: [
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
                                                permission={SUPER_ADMIN_USER_MANAGEMENT_PAGE}
                                            >
                                                <OrganizationProfilePage />
                                            </RoleBasedRouter>
                                        ),
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: 'profile/:mode?',
                        element: (
                            <RoleBasedRouter permission={HAS_LOGIN}>
                                <ProfilePage />
                            </RoleBasedRouter>
                        ),
                    },
                ],
            },

            {
                path: '*',
                Component: NotFoundPage,
            },
        ],
    },
]);
