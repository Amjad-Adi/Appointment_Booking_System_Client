import type { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    hasError?: boolean;
};

export function Input({ hasError = false, className, ...props }: InputProps) {
    return (
        <input
            className={twMerge(
                'bg-input font-inter box-border h-8 w-full rounded-lg border px-3 py-2 text-[11px] outline-none',
                'border-input-border',
                'placeholder:text-input-placeholder',
                'hover:border-input-border-hover hover:bg-input-hover',
                'focus:border-input-border-focus focus:ring-2',
                'disabled:bg-input-disabled disabled:text-input-disabled-text disabled:cursor-not-allowed',
                hasError
                    ? 'border-error hover:border-error focus:border-error focus:ring-error/20'
                    : 'focus:ring-primary/20',
                className,
            )}
            {...props}
        />
    );
}
