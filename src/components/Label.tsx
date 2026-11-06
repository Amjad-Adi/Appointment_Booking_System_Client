import type { LabelHTMLAttributes, ReactNode } from 'react';

export interface LabelModel extends LabelHTMLAttributes<HTMLLabelElement> {
    children: ReactNode;
}

export function Label({ children, className = '', ...props }: LabelModel) {
    return (
        <label
            className={`flex items-center text-[12px] font-medium text-foreground ${className}`}
            {...props}
        >
            {children}
        </label>
    );
}
