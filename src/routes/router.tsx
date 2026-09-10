import { createBrowserRouter } from 'react-router';
import { Login } from '../features/auth/pages/login/Login.tsx';
import { AuthLayout } from '../features/auth/layouts/Auth.tsx';
import { Register } from '../features/auth/pages/register/Register.tsx';
import { ManagementLayout } from '../features/management/layout/main-management.tsx';
import {
    SuperAdminUsersPage,
} from '../features/management/super-admin-view/pages/UsersPage.tsx';
import { RoleBasedRouter } from './RoleBasedRouter.tsx';
import {
    HAS_LOGIN,
    SUPER_ADMIN_ORGANIZATIONS_MANAGEMENT_PAGE,
    SUPER_ADMIN_USER_MANAGEMENT_PAGE,
} from '../permissions/permissions.ts';
import { OrganizationProfile } from '../features/management/organizations/OrganizationProfile.tsx';
import { UserProfile } from '../features/management/users/UserProfile.tsx';
import { NotFoundPage } from '../features/NotFoundPage.tsx';
import { SuperAdminLayout } from '../features/management/super-admin-view/layout/SuperAdminLayout.tsx';
import {
    SuperAdminOrganizationsPage
} from '../features/management/super-admin-view/pages/organizations/OrganizationsPage.tsx';

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
                                element: (
                                    <RoleBasedRouter permission={SUPER_ADMIN_USER_MANAGEMENT_PAGE}>
                                        <SuperAdminUsersPage />
                                    </RoleBasedRouter>
                                ),
                            },
                            {
                                path: 'organizations',
                                element: (
                                    <RoleBasedRouter
                                        permission={SUPER_ADMIN_ORGANIZATIONS_MANAGEMENT_PAGE}>
                                        <SuperAdminOrganizationsPage />
                                    </RoleBasedRouter>
                                ),
                            },
                        ],
                    },
                    {
                        path: 'organizations/:organizationUuid',
                        Component: OrganizationProfile,
                    },
                    {
                        path: 'users/:userUuid',
                        Component: UserProfile,
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