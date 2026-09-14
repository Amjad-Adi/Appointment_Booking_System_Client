import type { InputHTMLAttributes } from 'react';

import { Input } from './Input.tsx';
import { Label } from './Label.tsx';

export interface TextFieldModel extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    isLabelDisabled?: boolean;
    hasError?: boolean;
    errorMessage?: string;
}

export function TextField({
    hasError = false,
    errorMessage,
    label,
    isLabelDisabled = false,
    id,
    name,
    ...props
}: TextFieldModel) {
    const inputId = id ?? name;

    return (
        <div className={"gap-0"}>
            {!isLabelDisabled && <Label htmlFor={inputId}>{label}</Label>}

            <Input
                hasError={hasError || !!errorMessage}
                errorMessage={errorMessage}
                id={inputId}
                name={name}
                {...props}
            />
        </div>
    );
}
