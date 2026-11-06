import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Info, Tags } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../@/components/ui/Tooltip.tsx';

import { EntityImage } from '../../../components/EntityImage.tsx';

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
    const scrollerRef = useRef<HTMLDivElement>(null);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollState = useCallback(() => {
        const element = scrollerRef.current;

        if (!element) {
            return;
        }

        setCanScrollLeft(element.scrollLeft > 4);
        setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 4);
    }, []);

    useEffect(() => {
        const element = scrollerRef.current;

        if (!element) {
            return;
        }

        const frame = window.requestAnimationFrame(updateScrollState);

        element.addEventListener('scroll', updateScrollState, { passive: true });

        const observer = new ResizeObserver(updateScrollState);
        observer.observe(element);

        return () => {
            window.cancelAnimationFrame(frame);
            element.removeEventListener('scroll', updateScrollState);
            observer.disconnect();
        };
    }, [updateScrollState]);

    const scrollCategories = (direction: -1 | 1) => {
        const element = scrollerRef.current;

        if (!element) {
            return;
        }

        element.scrollBy({
            left: direction * Math.max(220, element.clientWidth * 0.7),
            behavior: 'smooth',
        });
    };

    return (
        <div className="relative mb-3 w-full overflow-hidden rounded-lg border border-border bg-muted">
            <div
                ref={scrollerRef}
                className="flex w-full gap-2 overflow-x-auto p-2"
                role="group"
                aria-label="Service categories"
            >
                {/* All services */}
                <button
                    type="button"
                    onClick={() => onSelect(undefined)}
                    className={`flex h-14 shrink-0 items-center gap-2 rounded-md border px-3 transition-colors ${
                        selectedCategoryUuid === undefined
                            ? 'border-border-strong bg-card'
                            : 'border-transparent hover:bg-secondary'
                    }`}
                >
                    <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                        <span className="text-[10px] font-semibold text-muted-foreground">ALL</span>
                    </div>

                    <div className="flex min-w-0 flex-col text-left">
                        <span className="text-[11px] font-semibold text-foreground">
                            All Services
                        </span>

                        <span className="text-[9px] text-muted-foreground">Show all services</span>
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
                                    ? 'border-border-strong bg-card'
                                    : 'border-transparent hover:bg-secondary'
                            }`}
                        >
                            <EntityImage
                                src={category.picturePath}
                                alt={category.name}
                                icon={Tags}
                                className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground"
                                iconClassName="size-4"
                            />

                            <div className="flex max-w-32 min-w-0 items-center gap-1 text-left">
                                <span className="min-w-0 truncate text-[11px] font-semibold text-foreground">
                                    {category.name}
                                </span>

                                {hasDescription ? (
                                    <TooltipTrigger
                                        render={
                                            <span className="shrink-0 cursor-default">
                                                <Info
                                                    className="size-3.5 text-muted-foreground"
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

            {canScrollLeft ? (
                <button
                    type="button"
                    onClick={() => scrollCategories(-1)}
                    aria-label="Scroll categories left"
                    className="absolute top-1/2 left-1 z-10 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-secondary-foreground shadow-sm transition-colors hover:bg-secondary hover:text-foreground"
                >
                    <ChevronLeft className="size-3.5" strokeWidth={2} />
                </button>
            ) : null}

            {canScrollRight ? (
                <button
                    type="button"
                    onClick={() => scrollCategories(1)}
                    aria-label="Scroll categories right"
                    className="absolute top-1/2 right-1 z-10 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-secondary-foreground shadow-sm transition-colors hover:bg-secondary hover:text-foreground"
                >
                    <ChevronRight className="size-3.5" strokeWidth={2} />
                </button>
            ) : null}
        </div>
    );
}
