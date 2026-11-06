import type { LucideIcon } from 'lucide-react';

import { Button } from './Button.tsx';

export interface ViewOption<T extends string> {
    value: T;
    label: string;
    icon: LucideIcon;
}

interface ViewSwitcherProps<T extends string> {
    value: T;
    options: ViewOption<T>[];
    onChange: (value: T) => void;
}

export function ViewSwitcher<T extends string>({ value, options, onChange }: ViewSwitcherProps<T>) {
    return (
        <div className="group flex h-8 items-center justify-center rounded-md border border-border bg-card px-0.5 py-4">
            {options.map(({ value: optionValue, label, icon: Icon }) => {
                const isSelected = value === optionValue;

                return (
                    <div key={optionValue} className="group">
                        <Button
                            type="button"
                            aria-label={`${label} view`}
                            aria-pressed={isSelected}
                            onClick={() => onChange(optionValue)}
                            className={`flex h-7 min-h-0 w-8 min-w-0 items-center justify-center rounded p-0 transition-colors ${
                                isSelected
                                    ? 'bg-muted text-foreground'
                                    : 'bg-transparent text-muted-foreground group-hover:bg-secondary group-hover:text-foreground'
                            }`}
                        >
                            <Icon
                                className={`size-3.5 ${
                                    isSelected
                                        ? 'text-foreground'
                                        : 'text-muted-foreground group-hover:text-foreground'
                                }`}
                                strokeWidth={1.8}
                            />
                        </Button>
                    </div>
                );
            })}
        </div>
    );
}
