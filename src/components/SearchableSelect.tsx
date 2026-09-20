import {
    forwardRef,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type FocusEvent,
    type ReactNode,
} from 'react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import { Label } from './Label.tsx';
import { ErrorField } from './ErrorField.tsx';

export interface SearchableSelectOption {
    value: string;
    label: string;
}

export interface SearchableSelectProps {
    id?: string;
    name?: string;
    label?: string;
    options: readonly SearchableSelectOption[];
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    isLabelDisabled?: boolean;
    hasError?: boolean;
    errorMessage?: string;
    wrapperClassName?: string;
    className?: string;
    disabled?: boolean;
    onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
    onBlur?: (event: FocusEvent<HTMLSelectElement>) => void;
    onSearchChange?: (search: string) => void;
}

export const SearchableSelect = forwardRef<HTMLSelectElement, SearchableSelectProps>(
    function SearchableSelect(
        {
            id,
            name,
            label,
            options,
            value,
            defaultValue = '',
            placeholder = 'Select...',
            searchPlaceholder = 'Search...',
            isLabelDisabled = false,
            hasError = false,
            errorMessage,
            wrapperClassName,
            className,
            disabled = false,
            onChange,
            onBlur,
            onSearchChange,
        },
        ref,
    ) {
        const containerRef = useRef<HTMLDivElement>(null);
        const searchInputRef = useRef<HTMLInputElement>(null);

        const [open, setOpen] = useState(false);
        const [search, setSearch] = useState('');
        const [internalValue, setInternalValue] = useState(defaultValue);

        const selectedValue = value ?? internalValue;

        const selectedOption = useMemo(
            () => options.find((option) => option.value === selectedValue),
            [options, selectedValue],
        );

        const filteredOptions = useMemo(
            () =>
                options.filter((option) =>
                    option.label.toLowerCase().includes(search.toLowerCase()),
                ),
            [options, search],
        );

        useEffect(() => {
            if (value !== undefined) {
                setInternalValue(value);
            }
        }, [value]);

        useEffect(() => {
            function handleClickOutside(event: MouseEvent) {
                if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                    setOpen(false);
                    setSearch('');
                }
            }

            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, []);

        useEffect(() => {
            if (open) {
                requestAnimationFrame(() => {
                    searchInputRef.current?.focus();
                });
            }
        }, [open]);

        const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newSearch = event.target.value;

            setSearch(newSearch);
            onSearchChange?.(newSearch);
        };

        const handleSelect = (optionValue: string) => {
            setInternalValue(optionValue);

            const event = {
                target: {
                    name,
                    value: optionValue,
                },
                currentTarget: {
                    name,
                    value: optionValue,
                },
            } as ChangeEvent<HTMLSelectElement>;

            onChange?.(event);

            setOpen(false);
            setSearch('');
            onSearchChange?.('');
        };

        const handleBlur = () => {
            const event = {
                target: {
                    name,
                    value: selectedValue,
                },
                currentTarget: {
                    name,
                    value: selectedValue,
                },
            } as FocusEvent<HTMLSelectElement>;

            onBlur?.(event);
        };
        console.log('SearchableSelect value:', value);
        console.log('selectedValue:', selectedValue);
        console.log('selectedOption:', selectedOption);
        return (
            <div ref={containerRef} className={twMerge('relative w-full', wrapperClassName)}>
                {!isLabelDisabled && <Label htmlFor={id}>{label}</Label>}

                {/* Hidden native select for React Hook Form */}
                <select
                    ref={ref}
                    id={id}
                    name={name}
                    value={selectedValue}
                    disabled={disabled}
                    tabIndex={-1}
                    aria-hidden="true"
                    onChange={onChange}
                    onBlur={handleBlur}
                    className="pointer-events-none absolute h-0 w-0 opacity-0"
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    onClick={() => {
                        if (!disabled) {
                            setOpen((current) => !current);
                        }
                    }}
                    className={twMerge(
                        'font-inter box-border flex h-8 w-full items-center justify-between rounded-lg border px-2 py-1 text-left text-[11px] outline-none',
                        'bg-input text-input-placeholder',
                        'border-input-border',
                        'hover:border-input-border-hover hover:bg-input-hover',
                        'focus:border-input-border-focus focus:ring-primary/20 focus:ring-2',
                        'disabled:bg-input-disabled disabled:text-input-disabled-text disabled:cursor-not-allowed',
                        hasError || errorMessage
                            ? 'border-error focus:border-error focus:ring-error/20'
                            : '',
                        className,
                    )}
                >
                    <span
                        className={twMerge('truncate', !selectedOption && 'text-input-placeholder')}
                    >
                        {selectedOption?.label ?? placeholder}
                    </span>

                    <ChevronDownIcon className="size-3.5 shrink-0" />
                </button>

                {open && (
                    <div className="border-input-border bg-input absolute z-50 mt-1 w-full rounded-lg border p-1 shadow-md">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder={searchPlaceholder}
                            className="font-inter border-input-border bg-input focus:border-input-border-focus focus:ring-primary/20 mb-1 h-7 w-full rounded-md border px-2 text-[11px] outline-none focus:ring-2"
                        />

                        <div role="listbox" className="max-h-48 overflow-y-auto">
                            {filteredOptions.length === 0 ? (
                                <div className="px-2 py-2 text-[11px] text-[#777789]">
                                    No results found.
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="option"
                                        aria-selected={option.value === selectedValue}
                                        onClick={() => handleSelect(option.value)}
                                        className="hover:bg-input-hover flex h-7 w-full items-center justify-between rounded-md px-2 text-left text-[11px]"
                                    >
                                        <span className="truncate">{option.label}</span>

                                        {option.value === selectedValue && (
                                            <CheckIcon className="size-3.5 shrink-0" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}

                <ErrorField errorMessage={errorMessage} />
            </div>
        );
    },
);

SearchableSelect.displayName = 'SearchableSelect';
