import type { ReactNode } from 'react';
import { useEffect } from 'react';
import {
    type DefaultValues,
    type FieldErrors,
    type FieldValues,
    type Path,
    type Resolver,
    useForm,
    useWatch,
} from 'react-hook-form';

import { TextField } from './TextField.tsx';
import { Select } from './Select.tsx';
import { Button } from './Button.tsx';
import { Label } from './Label.tsx';

export interface EditDialogSelectOption<TValue extends string> {
    value: TValue;
    label: string;
}

export interface EditDialogField<TFieldValues extends FieldValues> {
    name: Path<TFieldValues>;
    label: string;
    type: 'text' | 'email' | 'select';
    options?: readonly EditDialogSelectOption<string>[];
    placeholder?: string;
}

interface EditDialogProps<TFieldValues extends FieldValues> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    resolver: Resolver<TFieldValues>;
    defaultValues: DefaultValues<TFieldValues>;
    fields: readonly EditDialogField<TFieldValues>[];
    readOnlyContent?: ReactNode;
    submitLabel?: string;
    cancelLabel?: string;
    errorMessage?: string;
    onSubmit: (changedValues: Partial<TFieldValues>) => Promise<void>;
}

export function EditDialog<TFieldValues extends FieldValues>({
    open,
    onOpenChange,
    title,
    description,
    resolver,
    defaultValues,
    fields,
    readOnlyContent,
    submitLabel = 'Apply Changes',
    cancelLabel = 'Cancel',
    errorMessage,
    onSubmit,
}: EditDialogProps<TFieldValues>) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<TFieldValues>({
        resolver,
        defaultValues,
    });

    /*
     * useWatch is intentionally used here instead of watch().
     * The dialog needs to rerender whenever one of its editable
     * fields changes so that hasChanges is recalculated.
     */
    const watchedValues = useWatch({
        control,
    });

    const hasChanges = fields.some((field) => {
        const fieldName = field.name;

        return watchedValues?.[fieldName] !== defaultValues[fieldName];
    });

    useEffect(() => {
        if (open) {
            reset(defaultValues);
        }
    }, [open, defaultValues, reset]);

    const handleFormSubmit = async (data: TFieldValues) => {
        const changedValues: Partial<TFieldValues> = {};

        for (const field of fields) {
            const fieldName = field.name;

            if (data[fieldName] !== defaultValues[fieldName]) {
                Object.assign(changedValues, {
                    [fieldName]: data[fieldName],
                });
            }
        }

        if (Object.keys(changedValues).length === 0) {
            onOpenChange(false);
            return;
        }

        await onSubmit(changedValues);
    };

    const handleInvalidSubmit = (validationErrors: FieldErrors<TFieldValues>) => {
        console.error('Edit dialog validation failed:', validationErrors);
    };

    const handleCancel = () => {
        reset(defaultValues);
        onOpenChange(false);
    };

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-2 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-4 backdrop-blur-[2px] sm:py-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-dialog-title"
        >
            <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-[#d3d3df] bg-[#f5f5f8] shadow-2xl">
                {/* Header */}
                <div className="shrink-0 border-b border-[#d3d3df] px-5 py-4 sm:px-6">
                    <h2
                        id="edit-dialog-title"
                        className="text-[15px] font-semibold tracking-tight text-[#343447]"
                    >
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-0.5 text-[11px] leading-4 text-[#777789]">{description}</p>
                    )}
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(handleFormSubmit, handleInvalidSubmit)}
                    className="flex min-h-0 flex-col overflow-y-auto px-5 py-4 sm:px-6 sm:py-5"
                >
                    <div className="flex flex-col gap-3 sm:gap-4">
                        {/* Read-only information */}
                        {readOnlyContent}

                        {/* Editable fields */}
                        {fields.map((field) => {
                            const fieldName = field.name;
                            const fieldError = errors[fieldName];

                            if (field.type === 'select') {
                                return (
                                    <div key={String(fieldName)} className="w-full">
                                        <Label htmlFor={String(fieldName)}>{field.label}</Label>

                                        <Select
                                            id={String(fieldName)}
                                            hasError={Boolean(fieldError)}
                                            {...register(fieldName)}
                                            className="h-8 px-2.5 text-[11px] sm:h-8 sm:px-2.5 sm:text-[11px] md:h-8 md:text-[11px]"
                                        >
                                            <option value="">
                                                {field.placeholder ?? `Select ${field.label}`}
                                            </option>

                                            {field.options?.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Select>

                                        {fieldError?.message && (
                                            <p className="pt-1 text-[10px] leading-4 text-[#c94a5c]">
                                                {String(fieldError.message)}
                                            </p>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <TextField
                                    key={String(fieldName)}
                                    id={String(fieldName)}
                                    label={field.label}
                                    type={field.type}
                                    hasError={Boolean(fieldError)}
                                    {...register(fieldName)}
                                />
                            );
                        })}

                        {/* Mutation error */}
                        {errorMessage && (
                            <p className="w-full pt-1 text-center text-[10px] leading-4 text-[#c94a5c]">
                                {errorMessage}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex shrink-0 flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <div className="group sm:w-auto">
                            <Button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="h-8 w-full border border-[#d3d3df] bg-transparent px-3 text-[11px] font-semibold text-[#454556] hover:bg-[#ededf2] hover:text-[#343447] sm:h-8 sm:w-auto sm:px-3 sm:text-[11px] md:h-8 md:w-auto md:px-3 md:text-[11px]"
                            >
                                {cancelLabel}
                            </Button>
                        </div>

                        <div className="group sm:w-auto">
                            <Button
                                type="submit"
                                disabled={isSubmitting || !hasChanges}
                                className="h-8 w-full px-3 text-[11px] font-semibold sm:h-8 sm:w-auto sm:px-3 sm:text-[11px] md:h-8 md:w-auto md:px-3 md:text-[11px]"
                            >
                                {isSubmitting ? 'Saving...' : submitLabel}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
