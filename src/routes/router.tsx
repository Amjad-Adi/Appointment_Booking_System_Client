import { createBrowserRouter } from 'react-router';
import { Login } from '../features/auth/pages/login/Login.tsx';
import { Register } from '../features/auth/components/Register.tsx';
import { AuthLayout } from '../features/auth/layouts/Auth.tsx';

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
        ],
    },
]);
