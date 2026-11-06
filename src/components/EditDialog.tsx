import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Tags } from 'lucide-react';
import {
    type DefaultValues,
    type FieldValues,
    type Path,
    type Resolver,
    Controller,
    useForm,
    useWatch,
} from 'react-hook-form';

import { TextField } from './TextField.tsx';
import { Select } from './Select.tsx';
import { SearchableSelect } from './SearchableSelect.tsx';
import { Button } from './Button.tsx';
import { EntityImage } from './EntityImage.tsx';

export interface EditDialogSelectOption<TValue extends string> {
    value: TValue;
    label: string;
}

export interface EditDialogMultiSelectOption<TValue extends string> {
    value: TValue;
    label: string;
    description?: string;
    imagePath?: string;
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
        | 'multi-select'
        | 'datetime-local';

    options?: readonly EditDialogSelectOption<string>[];
    multiSelectOptions?: readonly EditDialogMultiSelectOption<string>[];
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
    topContent?: ReactNode;
    hasExternalChanges?: boolean;
    readOnlyContent?: ReactNode;
    submitLabel?: string;
    cancelLabel?: string;
    errorMessage?: string;
    fieldErrors?: Partial<Record<Path<TInput>, string>>;
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
    topContent,
    hasExternalChanges = false,
    readOnlyContent,
    submitLabel = 'Apply Changes',
    cancelLabel = 'Cancel',
    errorMessage,
    fieldErrors,
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

    const hasChanges =
        hasExternalChanges ||
        fields.some((field) => {
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

    const handleCancel = () => {
        reset(defaultValues);
        onOpenChange(false);
    };

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-200 flex items-start justify-center overflow-y-auto bg-overlay px-4 py-4 backdrop-blur-[2px] sm:py-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-dialog-title"
        >
            <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl sm:max-h-[calc(100vh-3rem)]">
                <div className="shrink-0 border-b border-border px-5 py-4 sm:px-6">
                    <h2
                        id="edit-dialog-title"
                        className="text-[15px] font-semibold tracking-tight text-foreground"
                    >
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{description}</p>
                    )}
                </div>

                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4 sm:px-6 sm:py-5"
                >
                    <div className="flex flex-col gap-3 sm:gap-4">
                        {topContent}

                        {readOnlyContent}

                        {fields.map((field) => {
                            const fieldName = field.name;
                            const fieldError = errors[fieldName];

                            const fieldErrorMessage = fieldError?.message
                                ? String(fieldError.message)
                                : fieldErrors?.[fieldName];

                            if (field.type === 'checkbox') {
                                return (
                                    <label
                                        key={String(fieldName)}
                                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5"
                                    >
                                        <input
                                            id={String(fieldName)}
                                            type="checkbox"
                                            {...register(fieldName)}
                                            className="size-3.5 shrink-0 accent-primary"
                                        />

                                        <span className="min-w-0">
                                            <span className="block text-[11px] font-medium text-foreground">
                                                {field.label}
                                            </span>

                                            {field.placeholder && (
                                                <span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">
                                                    {field.placeholder}
                                                </span>
                                            )}
                                        </span>
                                    </label>
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

                                            return (
                                                <div className="flex flex-col">
                                                    <label className="mb-1.5 text-[11px] font-medium text-foreground">
                                                        {field.label}
                                                    </label>

                                                    <div
                                                        className={`max-h-48 overflow-y-auto rounded-lg border bg-card p-1.5 ${
                                                            fieldError
                                                                ? 'border-destructive'
                                                                : 'border-border'
                                                        }`}
                                                    >
                                                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                                            {(field.multiSelectOptions ?? []).map(
                                                                (option) => {
                                                                    const selected =
                                                                        selectedValues.includes(
                                                                            option.value,
                                                                        );

                                                                    return (
                                                                        <button
                                                                            key={option.value}
                                                                            type="button"
                                                                            onClick={() =>
                                                                                controllerField.onChange(
                                                                                    selected
                                                                                        ? selectedValues.filter(
                                                                                              (
                                                                                                  value,
                                                                                              ) =>
                                                                                                  value !==
                                                                                                  option.value,
                                                                                          )
                                                                                        : [
                                                                                              ...selectedValues,
                                                                                              option.value,
                                                                                          ],
                                                                                )
                                                                            }
                                                                            className={`flex min-w-0 items-center gap-2 rounded-md border p-2 text-left transition-colors ${
                                                                                selected
                                                                                    ? 'border-border-strong bg-secondary'
                                                                                    : 'border-transparent hover:bg-secondary'
                                                                            }`}
                                                                        >
                                                                            <EntityImage
                                                                                src={option.imagePath}
                                                                                alt={option.label}
                                                                                icon={Tags}
                                                                                className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground"
                                                                                iconClassName="size-4"
                                                                            />

                                                                            <div className="min-w-0 flex-1">
                                                                                <span className="block truncate text-[11px] font-medium text-foreground">
                                                                                    {option.label}
                                                                                </span>

                                                                                {option.description ? (
                                                                                    <span className="block truncate text-[9px] text-muted-foreground">
                                                                                        {
                                                                                            option.description
                                                                                        }
                                                                                    </span>
                                                                                ) : null}
                                                                            </div>
                                                                        </button>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    </div>

                                                    {fieldErrorMessage && (
                                                        <p className="mt-1 text-[10px] text-destructive">
                                                            {fieldErrorMessage}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        }}
                                    />
                                );
                            }

                            if (field.type === 'searchable-select') {
                                return (
                                    <SearchableSelect
                                        key={String(fieldName)}
                                        id={String(fieldName)}
                                        label={field.label}
                                        options={field.options ?? []}
                                        placeholder={field.placeholder ?? `Select ${field.label}`}
                                        searchPlaceholder={field.searchPlaceholder ?? 'Search...'}
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
                                        value={
                                            watchedValues?.[fieldName] === undefined ||
                                            watchedValues?.[fieldName] === null
                                                ? ''
                                                : String(watchedValues[fieldName])
                                        }
                                        placeholder={
                                            field.showPlaceholder === false
                                                ? undefined
                                                : (field.placeholder ?? `Select ${field.label}`)
                                        }
                                        {...register(fieldName)}
                                        className="h-8 px-2.5 text-[11px] sm:h-8 sm:px-2.5 sm:text-[11px] md:h-8 md:text-[11px]"
                                    >
                                        {field.options?.map((option) => (
                                            <option key={option.value} value={option.value}>
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
                            <p className="w-full pt-1 text-center text-[10px] leading-4 text-destructive">
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
                                className="h-8 w-full border border-border bg-transparent px-3 text-[11px] font-semibold text-secondary-foreground hover:bg-secondary hover:text-foreground sm:h-8 sm:w-auto sm:px-3 sm:text-[11px] md:h-8 md:w-auto md:px-3 md:text-[11px]"
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
