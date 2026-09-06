import { createBrowserRouter } from 'react-router';
import { Login } from '../features/auth/pages/login/Login.tsx';
import { AuthLayout } from '../features/auth/layouts/Auth.tsx';
import { Register } from '../features/auth/pages/register/Register.tsx';
import { Users } from 'lucide-react';
import { ManagementLayout } from '../features/management/layout/main-management.tsx';
import { User } from '../features/management/admin-view/pages/UserPage.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        children: [
            {
                path: 'auth',
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
                path: 'management',
                Component: ManagementLayout,
                children: [
                    {
                        path: 'admins',
                        Component: User,
                    },
                ],
            },
        ],
    },
]);
