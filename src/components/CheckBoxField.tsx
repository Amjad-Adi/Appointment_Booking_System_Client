import type { ChangeEventHandler } from 'react';
import { Checkbox } from './CheckBox.tsx';
import { Label } from './Label.tsx';

export interface CheckboxFieldModel {
    label: string;
    name: string;
    checked?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    disabled?: boolean;
}

export function CheckboxField({
    label,
    name,
    checked,
    onChange,
    disabled = false,
}: CheckboxFieldModel) {
    return (
        <Label
            htmlFor={name}
            className="flex shrink-0 cursor-pointer items-center gap-1 text-[10px] sm:gap-[0.4vw] sm:text-[11px] md:text-[12px] lg:text-[14px]"
        >
            <Checkbox
                id={name}
                name={name}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="h-3 w-3 shrink-0 sm:h-[1.2vw] sm:w-[1.2vw] md:h-[1vw] md:w-[1vw]"
            />

            <span className="whitespace-nowrap">{label}</span>
        </Label>
    );
}
