import type { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { ErrorField } from './ErrorField.tsx';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    hasError?: boolean;
    errorMessage?: string;
};

export function Input({ hasError = false, errorMessage, className, ...props }: InputProps) {
    return (
        <div className="max-w-full min-w-0">
            <input
                className={twMerge(
                    'bg-card font-inter box-border h-8 w-full rounded-lg border px-3 py-2 text-[11px] outline-none',
                    'border-input',
                    'placeholder:text-muted-foreground',
                    'hover:border-border-strong hover:bg-muted',
                    'focus:border-ring focus:ring-2',
                    'disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed',
                    hasError
                        ? 'border-destructive hover:border-destructive focus:border-destructive focus:ring-destructive/20'
                        : 'focus:ring-primary/20',
                    className,
                )}
                {...props}
            />

            <ErrorField errorMessage={errorMessage} />
        </div>
    );
}
