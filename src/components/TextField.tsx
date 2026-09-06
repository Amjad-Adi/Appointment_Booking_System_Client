import type { InputHTMLAttributes } from 'react';
import { Input } from './Input.tsx';
import { Label } from './Label.tsx';
import { z } from 'zod';

export interface TextFieldModel extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    isLabelDisabled?: boolean;
    hasError?: boolean;
    errorMessage?: string; // Add this prop
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
        <div className="w-full py-1">
            {!isLabelDisabled && <Label htmlFor={inputId}>{label}</Label>}
            <Input hasError={hasError || !!errorMessage} id={inputId} name={name} {...props} />

            <div className="min-h-[18px] w-full pt-1 sm:min-h-[20px]">
                {errorMessage && (
                    <p className="text-error w-full self-start ps-2 text-left text-[10px] leading-tight sm:text-[12px]">
                        {errorMessage}
                    </p>
                )}
            </div>
        </div>
    );
}
