import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface SelectModel extends SelectHTMLAttributes<HTMLSelectElement> {
    children: ReactNode;
    hasError?: boolean;
    wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectModel>(function Select(
    { hasError = false, children, className, wrapperClassName, ...props },
    ref,
) {
    return (
        <div className={twMerge('min-w-0', wrapperClassName)}>
            <select
                {...props}
                ref={ref}
                className={twMerge(
                    'font-inter box-border h-8 w-full min-w-0 cursor-pointer rounded-lg border px-2 py-1 text-[11px] outline-none',
                    'bg-input text-shadow-text-secondary',
                    'border-input-border',
                    'hover:border-input-border-hover hover:bg-input-hover',
                    'focus:border-input-border-focus focus:ring-primary/20 focus:ring-2',
                    'disabled:bg-input-disabled disabled:text-input-disabled-text disabled:cursor-not-allowed',
                    hasError ? 'border-error focus:border-error focus:ring-error/20' : '',
                    className,
                )}
            >
                {children}
            </select>
        </div>
    );
});

Select.displayName = 'Select';
