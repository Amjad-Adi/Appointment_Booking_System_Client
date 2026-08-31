import {Outlet} from "react-router";

export function AuthLayout() {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Outlet />
        </div>
    );
}
