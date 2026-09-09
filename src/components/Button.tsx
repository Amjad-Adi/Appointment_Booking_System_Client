import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ButtonModel extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export function Button({ children, type = 'button', className = '', ...props }: ButtonModel) {
    return (
        <button
            type={type}
            className={twMerge(
                'w-full cursor-pointer rounded-lg border border-solid',
                'bg-action',
                'text-text-primary',
                'h-8 px-2 text-[11px]',
                'text-center font-bold',
                'transition-[background-color,transform] duration-200',
                'hover:-translate-y-0.5',
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}
