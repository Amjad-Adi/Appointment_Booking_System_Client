import type {ChangeEventHandler} from "react";
import {Checkbox} from "./CheckBox.tsx";
import {Label} from "./Label.tsx";

export interface CheckboxFieldModel {
    label: string;
    name: string;
    checked?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    disabled?: boolean;
}

export function CheckboxField({label, name, checked, onChange, disabled = false,}: CheckboxFieldModel) {
    return (
        <div className="flex items-center gap-2">
            <Checkbox id={name} name={name} checked={checked} onChange={onChange}
                      disabled={disabled}/>
            <Label htmlFor={name} className="mb-0">{label}</Label>
        </div>
    );
}