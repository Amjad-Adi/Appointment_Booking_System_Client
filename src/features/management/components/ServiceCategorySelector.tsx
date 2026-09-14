import { Info } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../@/components/ui/Tooltip.tsx';

import type { ServiceCategoryResponse } from '../../../models/service-category.model.ts';

interface ServiceCategorySelectorProps {
    categories: ServiceCategoryResponse[];
    selectedCategoryUuid?: string;
    onSelect: (categoryUuid?: string) => void;
}

export function ServiceCategorySelector({
    categories,
    selectedCategoryUuid,
    onSelect,
}: ServiceCategorySelectorProps) {
    return (
        <div className="mb-3 w-full overflow-hidden rounded-lg border border-[#d3d3df] bg-[#dedee8]">
            <div className="flex w-full gap-2 overflow-x-auto p-2">
                {/* All services */}
                <button
                    type="button"
                    onClick={() => onSelect(undefined)}
                    className={`flex h-14 shrink-0 items-center gap-2 rounded-md border px-3 transition-colors ${
                        selectedCategoryUuid === undefined
                            ? 'border-[#b9b9cc] bg-[#f5f5f8]'
                            : 'border-transparent hover:bg-[#ededf2]'
                    }`}
                >
                    <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#d3d3df]">
                        <span className="text-[10px] font-semibold text-[#777789]">ALL</span>
                    </div>

                    <div className="flex min-w-0 flex-col text-left">
                        <span className="text-[11px] font-semibold text-[#343447]">
                            All Services
                        </span>

                        <span className="text-[9px] text-[#777789]">Show all services</span>
                    </div>
                </button>

                {categories.map((category) => {
                    const selected = selectedCategoryUuid === category.uuid;

                    const hasDescription = Boolean(category.description?.trim());

                    const categoryContent = (
                        <button
                            type="button"
                            onClick={() => onSelect(category.uuid)}
                            className={`flex h-14 shrink-0 items-center gap-2 rounded-md border px-3 transition-colors ${
                                selected
                                    ? 'border-[#b9b9cc] bg-[#f5f5f8]'
                                    : 'border-transparent hover:bg-[#ededf2]'
                            }`}
                        >
                            <div className="size-9 shrink-0 overflow-hidden rounded-md bg-[#d3d3df]">
                                {category.picturePath &&
                                category.picturePath !== 'DEFAULT_PICTURE_PATH' ? (
                                    <img
                                        src={category.picturePath}
                                        alt=""
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center">
                                        <span className="text-[10px] font-semibold text-[#777789]">
                                            {category.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex max-w-32 min-w-0 items-center gap-1 text-left">
                                <span className="min-w-0 truncate text-[11px] font-semibold text-[#343447]">
                                    {category.name}
                                </span>

                                {hasDescription ? (
                                    <TooltipTrigger
                                        render={
                                            <span className="shrink-0 cursor-default">
                                                <Info
                                                    className="size-3.5 text-[#777789]"
                                                    strokeWidth={1.8}
                                                />
                                            </span>
                                        }
                                    />
                                ) : null}
                            </div>
                        </button>
                    );

                    if (!hasDescription) {
                        return <div key={category.uuid}>{categoryContent}</div>;
                    }

                    return (
                        <Tooltip key={category.uuid}>
                            {categoryContent}

                            <TooltipContent
                                side="top"
                                align="center"
                                className="max-w-xs text-[11px] leading-4 whitespace-normal"
                            >
                                {category.description}
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>
        </div>
    );
}
