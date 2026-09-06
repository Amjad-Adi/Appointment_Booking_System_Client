import { Outlet } from 'react-router';

export function ManagementLayout() {
    return (
        <div className="w-85% my-[20px] min-h-dvh flex">
            <nav className="w-30% flex items-center justify-between bg-slate-100"></nav>
            <div>
                <header className={'flex justify-between bg-slate-200'}>
                    <div className="w-20% flex items-center justify-between bg-slate-300">
                        <p>title</p>
                    </div>
                    <div className="w-60% flex items-center justify-between bg-slate-400"></div>
                </header>
                <Outlet />
            </div>
        </div>
    );
}
