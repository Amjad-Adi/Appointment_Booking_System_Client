import { Outlet } from 'react-router';

import { ThemeToggle } from '../../../components/ThemeToggle.tsx';

export function AuthLayout() {
    return (
        <div className="relative flex min-h-dvh w-full items-center justify-center">
            <div className="absolute top-4 right-4 z-10">
                <ThemeToggle syncToServer={false} />
            </div>

            <Outlet />
        </div>
    );
}
