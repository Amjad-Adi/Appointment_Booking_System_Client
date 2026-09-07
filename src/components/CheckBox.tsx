import type { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface CheckboxModel extends InputHTMLAttributes<HTMLInputElement> {
    type?: 'checkbox';
}

export function Checkbox({ type = 'checkbox', className = '', ...props }: CheckboxModel) {
    return (
        <input
            type={type}
            className={twMerge(
                'h-4 w-4 shrink-0 cursor-pointer',
                'sm:h-[1.2vw] sm:w-[1.2vw]',
                'md:h-[1vw] md:w-[1vw]',
                className,
            )}
            {...props}
        />
    );
}
