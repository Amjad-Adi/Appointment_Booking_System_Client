import { type ReactNode, type SelectHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface SelectModel extends SelectHTMLAttributes<HTMLSelectElement> {
    children: ReactNode;
    hasError?: boolean;
}

export function Select({ hasError = false, children, className = '', ...props }: SelectModel) {
    return (
        <div className="w-full py-1">
            <select
                {...props}
                className={twMerge(
                    'font-inter box-border h-11 w-full cursor-pointer rounded-lg border px-3 py-2 text-sm outline-none',
                    'bg-input text-shadow-text-secondary',
                    'border-input-border',
                    'hover:border-input-border-hover hover:bg-input-hover',
                    'focus:border-input-border-focus focus:ring-primary/20 focus:ring-2',
                    'disabled:bg-input-disabled disabled:text-input-disabled-text disabled:cursor-not-allowed',
                    'sm:h-[3.2vw] sm:px-[1vw] sm:text-[1.1vw]',
                    'md:h-[3vw] md:text-[1vw]',
                    `${hasError ? 'focus:border-error focus:ring-error/20' : 'border-gray-300'}`,
                    className,
                )}
            >
                {children}
            </select>
        </div>
    );
}
