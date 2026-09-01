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
                'bg-action hover:bg-action-hover',
                'text-text-primary',
                'h-11 px-4 text-sm',
                'text-center font-bold',
                'transition-[background-color,transform] duration-200',
                'hover:-translate-y-0.5',
                'sm:h-[3.75vw] sm:px-[2vw] sm:text-[1.2vw]',
                'md:h-[3.5vw] md:text-[1.1vw]',
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}
