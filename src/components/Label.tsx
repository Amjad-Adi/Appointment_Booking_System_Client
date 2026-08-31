import type { LabelHTMLAttributes, ReactNode } from "react";

export interface LabelModel extends LabelHTMLAttributes<HTMLLabelElement> {
    children: ReactNode;
}

export function Label({children, className = "", ...props}: LabelModel) {
    return (
        <label className={`flex text-sm font-medium text-slate-700  items-center ${className}`}{...props}>
            {children}
        </label>
    );
}