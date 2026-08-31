import type { InputHTMLAttributes } from "react";
import { Input } from "./Input.tsx";
import { Label } from "./Label.tsx";

export interface TextFieldModel
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    isLabelDisabled?: boolean;
}

export function TextField({label, isLabelDisabled = false, id, name, ...props}: TextFieldModel) {
    const inputId = id ?? name;
    return (
        <div className="w-full">
            {!isLabelDisabled && (<Label htmlFor={inputId}>{label}</Label>)}
            <Input id={inputId} name={name}{...props}/>
        </div>
    );
}