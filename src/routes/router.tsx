import { createBrowserRouter } from 'react-router';
import { Login } from '../features/auth/pages/login/Login.tsx';
import { AuthLayout } from '../features/auth/layouts/Auth.tsx';
import { Register } from '../features/auth/pages/register/Register.tsx';
import { ManagementLayout } from '../features/management/layout/main-management.tsx';
import { User } from '../features/management/admin-view/pages/UserPage.tsx';
import { RoleBasedRouter } from './RoleBasedRouter.tsx';
import { HAS_LOGIN, USER_MANAGEMENT_PAGE } from '../permissions/permissions.ts';

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
                        <ManagementLayout />
                    </RoleBasedRouter>
                ),
                children: [
                    {
                        path: 'admin',
                        children: [
                            {
                                path: 'users',
                                element: (
                                    <RoleBasedRouter permission={USER_MANAGEMENT_PAGE}>
                                        <User />
                                    </RoleBasedRouter>
                                ),
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);
