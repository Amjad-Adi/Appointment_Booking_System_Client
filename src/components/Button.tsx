import type {ButtonHTMLAttributes, ReactNode} from "react";

export interface ButtonModel extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export function Button({children, type = "button", className = "", ...props}: ButtonModel) {
    return (
        <button type={type}
                className={` border border-solid rounded-[0.5vw] text-[1.2vw] font-bold h-[8%] w-[90%] text-center  cursor-pointer transition-[background-color,transform] duration-200 hover:-translate-y-0.5 bg-indigo-100 hover:bg-sky-100 ease-in-out${className}`}{...props}>{children}</button>);
}