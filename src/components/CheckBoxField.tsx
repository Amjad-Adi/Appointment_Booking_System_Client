import type { InputHTMLAttributes, ReactNode } from 'react';
import { Checkbox } from './CheckBox.tsx';
import { Label } from './Label.tsx';

export interface CheckboxFieldModel extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    children: ReactNode;
}

export function CheckboxField({ children, id, disabled = false, ...props }: CheckboxFieldModel) {
    return (
        <Label
            htmlFor={id}
            className="flex shrink-0 cursor-pointer items-center gap-1 text-[10px] sm:gap-[0.4vw] sm:text-[11px] md:text-[12px] lg:text-[14px]"
        >
            <Checkbox
                id={id}
                type="checkbox"
                disabled={disabled}
                {...props}
                className="h-3 w-3 shrink-0 sm:h-[1.2vw] sm:w-[1.2vw] md:h-[1vw] md:w-[1vw]"
            />

            <span className="whitespace-nowrap">{children}</span>
        </Label>
    );
}
