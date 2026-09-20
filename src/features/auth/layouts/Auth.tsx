import { Outlet } from 'react-router';

export function AuthLayout() {
    return (
        <div className="flex min-h-dvh w-full items-center justify-center">
            <Outlet />
        </div>
    );
}
