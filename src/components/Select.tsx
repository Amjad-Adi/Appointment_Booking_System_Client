import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { Label } from './Label.tsx';
import { ErrorField } from './ErrorField.tsx';

export interface SelectModel extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    children: ReactNode;
    isLabelDisabled?: boolean;
    hasError?: boolean;
    errorMessage?: string;
    wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectModel>(function Select(
    {
        label,
        children,
        isLabelDisabled = false,
        hasError = false,
        errorMessage,
        wrapperClassName,
        id,
        name,
        className,
        ...props
    },
    ref,
) {
    const selectId = id ?? name;

    return (
        <div className={twMerge('w-full', wrapperClassName)}>
            {!isLabelDisabled && <Label htmlFor={selectId}>{label}</Label>}
            <select
                {...props}
                ref={ref}
                id={selectId}
                name={name}
                className={twMerge(
                    'font-inter box-border h-8 w-full min-w-0 cursor-pointer rounded-lg border px-2 py-1 text-left text-[11px] outline-none',
                    'bg-input text-[#343447]',
                    'border-input-border',
                    'hover:border-input-border-hover hover:bg-input-hover',
                    'focus:border-input-border-focus focus:ring-primary/20 focus:ring-2',
                    'disabled:bg-input-disabled disabled:text-input-disabled-text disabled:cursor-not-allowed',
                    hasError || errorMessage
                        ? 'border-error focus:border-error focus:ring-error/20'
                        : '',
                    className,
                )}
            >
                {children}
            </select>
            <ErrorField errorMessage={errorMessage} />
        </div>
    );
});

Select.displayName = 'Select';
