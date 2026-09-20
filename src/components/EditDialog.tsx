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
import { SearchableSelect } from './SearchableSelect.tsx';
import { Button } from './Button.tsx';

export interface EditDialogSelectOption<TValue extends string> {
    value: TValue;
    label: string;
}

export interface EditDialogField<TFieldValues extends FieldValues> {
    name: Path<TFieldValues>;
    label: string;
    type:
        | 'text'
        | 'email'
        | 'number'
        | 'color'
        | 'select'
        | 'searchable-select'
        | 'time'
        | 'checkbox'
        |'datetime-local';

    options?: readonly EditDialogSelectOption<string>[];
    placeholder?: string;
    searchPlaceholder?: string;
    showPlaceholder?: boolean;
    onSearchChange?: (search: string) => void;
}

interface EditDialogProps<TInput extends FieldValues, TOutput = TInput> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    resolver: Resolver<TInput, any, TOutput>;
    defaultValues: DefaultValues<TInput>;
    fields: readonly EditDialogField<TInput>[];
    readOnlyContent?: ReactNode;
    submitLabel?: string;
    cancelLabel?: string;
    errorMessage?: string;
    onSubmit: (changedValues: Partial<TOutput>) => Promise<void>;
}

export function EditDialog<TInput extends FieldValues, TOutput = TInput>({
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
}: EditDialogProps<TInput, TOutput>) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<TInput, any, TOutput>({
        resolver,
        defaultValues,
    });

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

    const handleFormSubmit = async (data: TOutput) => {
        const changedValues: Partial<TOutput> = {};

        for (const field of fields) {
            const fieldName = field.name as unknown as keyof TOutput;

            const currentValue = data[fieldName];
            const defaultValue = defaultValues[field.name];

            if ((currentValue as unknown) !== (defaultValue as unknown)) {
                Object.assign(changedValues, {
                    [fieldName]: currentValue,
                });
            }
        }

        await onSubmit(changedValues);
    };

    const handleInvalidSubmit = (validationErrors: FieldErrors<TInput>) => {
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
            className="fixed inset-0 z-200 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-4 backdrop-blur-[2px] sm:py-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-dialog-title"
        >
            <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-[#d3d3df] bg-[#f5f5f8] shadow-2xl sm:max-h-[calc(100vh-3rem)]">
                <div className="shrink-0 border-b border-[#d3d3df] px-5 py-4 sm:px-6">
                    <h2
                        id="edit-dialog-title"
                        className="text-[15px] font-semibold tracking-tight text-[#343447]"
                    >
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-0.5 text-[11px] leading-4 text-[#777789]">
                            {description}
                        </p>
                    )}
                </div>

                <form
                    onSubmit={handleSubmit(handleFormSubmit, handleInvalidSubmit)}
                    className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4 sm:px-6 sm:py-5"
                >
                    <div className="flex flex-col gap-3 sm:gap-4">
                        {readOnlyContent}

                        {fields.map((field) => {
                            const fieldName = field.name;
                            const fieldError = errors[fieldName];

                            const fieldErrorMessage = fieldError?.message
                                ? String(fieldError.message)
                                : undefined;

                            if (field.type === 'checkbox') {
                                return (
                                    <label
                                        key={String(fieldName)}
                                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#d3d3df] bg-white px-3 py-2.5"
                                    >
                                        <input
                                            id={String(fieldName)}
                                            type="checkbox"
                                            {...register(fieldName)}
                                            className="size-3.5 shrink-0 accent-[#343447]"
                                        />

                                        <span className="min-w-0">
                                            <span className="block text-[11px] font-medium text-[#343447]">
                                                {field.label}
                                            </span>

                                            {field.placeholder && (
                                                <span className="mt-0.5 block text-[10px] leading-4 text-[#777789]">
                                                    {field.placeholder}
                                                </span>
                                            )}
                                        </span>
                                    </label>
                                );
                            }

                            if (field.type === 'searchable-select') {
                                return (
                                    <SearchableSelect
                                        key={String(fieldName)}
                                        id={String(fieldName)}
                                        label={field.label}
                                        options={field.options ?? []}
                                        placeholder={
                                            field.placeholder ??
                                            `Select ${field.label}`
                                        }
                                        searchPlaceholder={
                                            field.searchPlaceholder ?? 'Search...'
                                        }
                                        hasError={Boolean(fieldError)}
                                        errorMessage={fieldErrorMessage}
                                        onSearchChange={field.onSearchChange}
                                        {...register(fieldName)}
                                        className="h-8 px-2.5 text-[11px]"
                                    />
                                );
                            }

                            if (field.type === 'select') {
                                return (
                                    <Select
                                        key={String(fieldName)}
                                        id={String(fieldName)}
                                        label={field.label}
                                        hasError={Boolean(fieldError)}
                                        errorMessage={fieldErrorMessage}
                                        {...register(fieldName)}
                                        className="h-8 px-2.5 text-[11px] sm:h-8 sm:px-2.5 sm:text-[11px] md:h-8 md:text-[11px]"
                                    >
                                        {field.showPlaceholder !== false && (
                                            <option value="">
                                                {field.placeholder ??
                                                    `Select ${field.label}`}
                                            </option>
                                        )}

                                        {field.options?.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </Select>
                                );
                            }

                            return (
                                <TextField
                                    key={String(fieldName)}
                                    id={String(fieldName)}
                                    label={field.label}
                                    type={field.type}
                                    hasError={Boolean(fieldError)}
                                    errorMessage={fieldErrorMessage}
                                    {...register(fieldName)}
                                />
                            );
                        })}

                        {errorMessage && (
                            <p className="w-full pt-1 text-center text-[10px] leading-4 text-[#c94a5c]">
                                {errorMessage}
                            </p>
                        )}
                    </div>

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
                                className="h-8 w-full px-3 text-[11px] font-semibold sm:h-8 sm:w-auto sm:px-3 md:h-8 md:w-auto md:px-3 md:text-[11px]"
                            >
                                {submitLabel}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
