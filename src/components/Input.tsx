import type { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: InputProps) {
    return (
        <input
            className={twMerge(
                'bg-input font-inter box-border h-11 w-full rounded-lg border px-3 py-2 text-sm outline-none',
                'border-input-border',
                'placeholder:text-input-placeholder',
                'hover:border-input-border-hover hover:bg-input-hover',
                'focus:border-input-border-focus focus:ring-primary/20 focus:ring-2',
                'disabled:bg-input-disabled disabled:text-input-disabled-text disabled:cursor-not-allowed',
                'sm:h-[3.2vw] sm:px-[1vw] sm:text-[1.1vw]',
                'md:h-[3vw] md:text-[1vw]',
                className,
            )}
            {...props}
        />
    );
}
