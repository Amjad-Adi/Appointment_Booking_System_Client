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
        <div className="group flex h-8 items-center justify-center rounded-md border border-[#d3d3df] bg-[#f5f5f8] px-0.5 py-4">
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
                                    ? 'bg-[#d3d3df] text-[#343447]'
                                    : 'bg-transparent text-[#777789] group-hover:bg-[#ededf2] group-hover:text-[#343447]'
                            }`}
                        >
                            <Icon
                                className={`size-3.5 ${
                                    isSelected
                                        ? 'text-[#343447]'
                                        : 'text-[#777789] group-hover:text-[#343447]'
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
