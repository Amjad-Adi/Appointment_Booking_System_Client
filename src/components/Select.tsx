import {
    Children,
    Fragment,
    forwardRef,
    isValidElement,
    useState,
    type ChangeEvent,
    type FocusEvent,
    type ReactNode,
    type Ref,
    type SelectHTMLAttributes,
} from 'react';
import { twMerge } from 'tailwind-merge';

import {
    Select as SelectPrimitive,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../@/components/ui/select.tsx';

import { Label } from './Label.tsx';
import { ErrorField } from './ErrorField.tsx';

export interface SelectModel extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    children: ReactNode;
    /*
     * Shown when no value is selected. It is never rendered as a list item,
     * so it cannot be chosen as a value. Selects that allow clearing keep an
     * explicit <option value=""> child, which stays selectable.
     */
    placeholder?: ReactNode;
    isLabelDisabled?: boolean;
    hasError?: boolean;
    errorMessage?: string;
    wrapperClassName?: string;
}

interface ParsedOption {
    value: string;
    label: ReactNode;
    disabled: boolean;
}

function parseOptions(children: ReactNode): ParsedOption[] {
    const options: ParsedOption[] = [];

    Children.forEach(children, (child) => {
        if (child === null || child === undefined || typeof child === 'boolean') {
            return;
        }

        if (Array.isArray(child)) {
            options.push(...parseOptions(child));

            return;
        }

        if (!isValidElement(child)) {
            return;
        }

        if (child.type === Fragment) {
            const fragmentProps = child.props as { children?: ReactNode };

            options.push(...parseOptions(fragmentProps.children));

            return;
        }

        if (child.type === 'option') {
            const option = child.props as {
                value?: string | number;
                disabled?: boolean;
                children?: ReactNode;
            };

            options.push({
                value: option.value === undefined ? '' : String(option.value),
                label: option.children,
                disabled: Boolean(option.disabled),
            });
        }
    });

    return options;
}

function normalizeValue(value: unknown): string {
    if (value === null || value === undefined) {
        return '';
    }

    if (Array.isArray(value)) {
        return value.length > 0 ? String(value[0]) : '';
    }

    return String(value);
}

export const Select = forwardRef<HTMLSelectElement, SelectModel>(function Select(
    {
        label,
        children,
        placeholder,
        isLabelDisabled = false,
        hasError = false,
        errorMessage,
        wrapperClassName,
        id,
        name,
        className,
        value,
        defaultValue,
        onChange,
        onBlur,
        disabled,
        required,
    },
    ref,
) {
    const selectId = id ?? name;

    const options = parseOptions(children);

    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(() =>
        normalizeValue(defaultValue),
    );

    const selectedValue = isControlled ? normalizeValue(value) : uncontrolledValue;

    const hasErrorState = hasError || Boolean(errorMessage);

    const handleValueChange = (nextValue: string | null) => {
        const normalizedNextValue = nextValue ?? '';

        if (!isControlled) {
            setUncontrolledValue(normalizedNextValue);
        }

        const event = {
            type: 'change',
            target: { name, value: normalizedNextValue },
            currentTarget: { name, value: normalizedNextValue },
        } as unknown as ChangeEvent<HTMLSelectElement>;

        onChange?.(event);
    };

    const handleBlur = () => {
        if (!onBlur) {
            return;
        }

        onBlur({
            type: 'blur',
            target: { name, value: selectedValue },
            currentTarget: { name, value: selectedValue },
        } as unknown as FocusEvent<HTMLSelectElement>);
    };

    return (
        <div className={twMerge('w-full', wrapperClassName)}>
            {!isLabelDisabled && <Label htmlFor={selectId}>{label}</Label>}

            <SelectPrimitive
                items={options.map((option) => ({
                    value: option.value,
                    label: option.label,
                }))}
                value={selectedValue}
                onValueChange={handleValueChange}
                name={name}
                inputRef={ref as unknown as Ref<HTMLInputElement>}
                disabled={disabled}
                required={required}
            >
                <SelectTrigger
                    id={selectId}
                    aria-invalid={hasErrorState || undefined}
                    onBlur={handleBlur}
                    className={twMerge(
                        'font-inter box-border h-8 w-full min-w-0 rounded-lg border px-2 py-1 text-left text-[11px]',
                        'bg-card text-foreground',
                        'border-input',
                        'hover:border-border-strong hover:bg-muted',
                        'focus-visible:border-ring focus-visible:ring-primary/20 focus-visible:ring-2',
                        'disabled:bg-muted disabled:text-muted-foreground',
                        hasErrorState &&
                            'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
                        className,
                    )}
                >
                    <SelectValue>
                        {(currentValue) => {
                            const normalizedCurrentValue = normalizeValue(currentValue);
                            const selectedOption = options.find(
                                (option) => option.value === normalizedCurrentValue,
                            );

                            if (selectedOption) {
                                return selectedOption.label;
                            }

                            if (normalizedCurrentValue === '' && placeholder) {
                                return (
                                    <span className="text-muted-foreground">{placeholder}</span>
                                );
                            }

                            return normalizedCurrentValue;
                        }}
                    </SelectValue>
                </SelectTrigger>

                <SelectContent alignItemWithTrigger={false} className="max-h-64">
                    {options.map((option, index) => (
                        <SelectItem
                            key={`${option.value}-${index}`}
                            value={option.value}
                            disabled={option.disabled}
                            className="py-1.5 pr-7 pl-2 text-[11px]"
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectPrimitive>

            <ErrorField errorMessage={errorMessage} />
        </div>
    );
});

Select.displayName = 'Select';
