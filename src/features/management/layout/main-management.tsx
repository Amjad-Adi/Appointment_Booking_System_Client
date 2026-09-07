import { data, Outlet } from 'react-router';
import { User } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserResponse } from '../../../models/user.model.ts';

export function ManagementLayout() {
    const queryClient = useQueryClient();
    const user: UserResponse = queryClient.getQueryData(['currentUser']) as UserResponse;
    return (
        <div className="w-85% my-[20px] flex min-h-dvh">
            <nav className="w-30% flex items-center justify-between bg-slate-100"></nav>
            <div>
                <header className={'flex justify-between bg-slate-200'}>
                    <div className="w-20% flex items-center justify-between bg-slate-300">
                        <p>title</p>
                    </div>
                    <div className="w-60% flex items-center justify-between bg-slate-400">
                        {user && (
                            <div>
                                <p>{`${user.firstName} ${user.lastName}`}</p>
                            </div>
                        )}
                    </div>
                </header>
                <Outlet />
            </div>
        </div>
    );
}
