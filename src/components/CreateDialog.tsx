import { Controller, useForm } from 'react-hook-form';
import type { DefaultValues, FieldErrors, FieldValues, Path, Resolver } from 'react-hook-form';

import { TextField } from './TextField.tsx';
import { Select } from './Select.tsx';
import { SearchableSelect } from './SearchableSelect.tsx';
import { Button } from './Button.tsx';
import { useEffect } from 'react';

export interface CreateDialogSelectOption<TValue extends string> {
    value: TValue;
    label: string;
}

export interface CreateDialogMultiSelectOption<
    TValue extends string,
> extends CreateDialogSelectOption<TValue> {
    description?: string;
    imagePath?: string;
}

export interface CreateDialogField<TFieldValues extends FieldValues> {
    name: Path<TFieldValues>;
    label: string;
    type:
        | 'text'
        | 'email'
        | 'password'
        | 'number'
        | 'datetime-local'
        | 'select'
        | 'searchable-select'
        | 'multi-select';
    options?: readonly CreateDialogSelectOption<string>[];
    multiSelectOptions?: readonly CreateDialogMultiSelectOption<string>[];
    placeholder?: string;
    searchPlaceholder?: string;
    onSearchChange?: (search: string) => void;
}

interface CreateDialogProps<TInput extends FieldValues, TOutput = TInput> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;

    resolver: Resolver<TInput, any, TOutput>;
    defaultValues?: DefaultValues<TInput>;
    fields: readonly CreateDialogField<TInput>[];

    submitLabel?: string;
    cancelLabel?: string;

    errorMessage?: string;
    fieldErrors?: Partial<Record<Path<TInput>, string>>;

    onSubmit: (values: TOutput) => Promise<void>;
}

export function CreateDialog<TInput extends FieldValues, TOutput = TInput>({
    open,
    onOpenChange,
    title,
    description,
    resolver,
    defaultValues,
    fields,
    submitLabel = 'Create',
    cancelLabel = 'Cancel',
    errorMessage,
    fieldErrors,
    onSubmit,
}: CreateDialogProps<TInput, TOutput>) {
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

    useEffect(() => {
        if (open) {
            reset(defaultValues);
        }
    }, [open, defaultValues, reset]);

    const handleFormSubmit = async (data: TOutput) => {
        await onSubmit(data);
    };

    const handleInvalidSubmit = (validationErrors: FieldErrors<TInput>) => {
        console.error('Create dialog validation failed:', validationErrors);
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
            aria-labelledby="create-dialog-title"
        >
            <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-[#d3d3df] bg-[#f5f5f8] shadow-2xl">
                <div className="shrink-0 border-b border-[#d3d3df] px-5 py-4 sm:px-6">
                    <h2
                        id="create-dialog-title"
                        className="text-[15px] font-semibold tracking-tight text-[#343447]"
                    >
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-0.5 text-[11px] leading-4 text-[#777789]">{description}</p>
                    )}
                </div>

                <form
                    onSubmit={handleSubmit(handleFormSubmit, handleInvalidSubmit)}
                    className="flex min-h-0 flex-col overflow-y-auto px-5 py-4 sm:px-6 sm:py-5"
                >
                    <div className="flex flex-col gap-3 sm:gap-4">
                        {fields.map((field) => {
                            const fieldName = field.name;
                            const fieldError = errors[fieldName];
                            const serverFieldError = fieldErrors?.[fieldName];

                            const errorMessage = fieldError?.message
                                ? String(fieldError.message)
                                : serverFieldError;

                            if (field.type === 'searchable-select') {
                                return (
                                    <SearchableSelect
                                        key={String(fieldName)}
                                        id={String(fieldName)}
                                        label={field.label}
                                        options={field.options ?? []}
                                        placeholder={field.placeholder ?? `Select ${field.label}`}
                                        searchPlaceholder={field.searchPlaceholder ?? 'Search...'}
                                        hasError={Boolean(fieldError) || Boolean(serverFieldError)}
                                        errorMessage={errorMessage}
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
                                        hasError={Boolean(fieldError) || Boolean(serverFieldError)}
                                        errorMessage={errorMessage}
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
                                );
                            }

                            if (field.type === 'multi-select') {
                                return (
                                    <Controller
                                        key={String(fieldName)}
                                        name={fieldName}
                                        control={control}
                                        render={({ field: controllerField }) => {
                                            const selectedValues: string[] = Array.isArray(
                                                controllerField.value,
                                            )
                                                ? controllerField.value
                                                : [];

                                            const options = field.multiSelectOptions ?? [];

                                            return (
                                                <div className="flex flex-col">
                                                    <label className="mb-1.5 text-[11px] font-medium text-[#343447]">
                                                        {field.label}
                                                    </label>

                                                    <div
                                                        className={`max-h-48 overflow-y-auto rounded-lg border bg-[#f5f5f8] p-1.5 ${
                                                            fieldError || serverFieldError
                                                                ? 'border-[#c94a5c]'
                                                                : 'border-[#d3d3df]'
                                                        }`}
                                                    >
                                                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                                            {options.map((option) => {
                                                                const selected =
                                                                    selectedValues.includes(
                                                                        option.value,
                                                                    );

                                                                return (
                                                                    <button
                                                                        key={option.value}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const next = selected
                                                                                ? selectedValues.filter(
                                                                                      (value) =>
                                                                                          value !==
                                                                                          option.value,
                                                                                  )
                                                                                : [
                                                                                      ...selectedValues,
                                                                                      option.value,
                                                                                  ];

                                                                            controllerField.onChange(
                                                                                next,
                                                                            );
                                                                        }}
                                                                        className={`flex min-w-0 items-center gap-2 rounded-md border p-2 text-left transition-colors ${
                                                                            selected
                                                                                ? 'border-[#b9b9cc] bg-[#ededf2]'
                                                                                : 'border-transparent hover:bg-[#ededf2]'
                                                                        }`}
                                                                    >
                                                                        <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#d3d3df]">
                                                                            {option.imagePath ? (
                                                                                <img
                                                                                    src={
                                                                                        option.imagePath
                                                                                    }
                                                                                    alt=""
                                                                                    className="size-full object-cover"
                                                                                />
                                                                            ) : (
                                                                                <span className="text-[10px] font-semibold text-[#777789]">
                                                                                    {option.label
                                                                                        .charAt(0)
                                                                                        .toUpperCase()}
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        <div className="min-w-0 flex-1">
                                                                            <p className="truncate text-[10px] font-semibold text-[#343447]">
                                                                                {option.label}
                                                                            </p>

                                                                            {option.description && (
                                                                                <p className="truncate text-[9px] text-[#777789]">
                                                                                    {
                                                                                        option.description
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>

                                                                        <div
                                                                            className={`flex size-4 shrink-0 items-center justify-center rounded-full border text-[9px] ${
                                                                                selected
                                                                                    ? 'border-[#343447] bg-[#343447] text-white'
                                                                                    : 'border-[#b9b9cc]'
                                                                            }`}
                                                                        >
                                                                            {selected && '✓'}
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div className="mt-1.5 flex min-h-4 items-center justify-between">
                                                        {fieldError || serverFieldError ? (
                                                            <p className="text-[10px] leading-4 text-[#c94a5c]">
                                                                {errorMessage}
                                                            </p>
                                                        ) : (
                                                            <p className="text-[9px] text-[#777789]">
                                                                Select one or more categories
                                                            </p>
                                                        )}

                                                        <span className="ml-auto text-[9px] text-[#777789]">
                                                            {selectedValues.length} selected
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                );
                            }

                            return (
                                <TextField
                                    key={String(fieldName)}
                                    id={String(fieldName)}
                                    label={field.label}
                                    type={field.type}
                                    hasError={Boolean(fieldError) || Boolean(serverFieldError)}
                                    errorMessage={errorMessage}
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
                                disabled={isSubmitting}
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
