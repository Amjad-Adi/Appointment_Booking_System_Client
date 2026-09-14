import type { ServiceCategoryResponse } from '../../../models/service-category.model.ts';

interface ServiceCategorySelectorProps {
    categories: ServiceCategoryResponse[];
    selectedCategoryUuid?: string;
    onSelect: (categoryUuid?: string) => void;
}

export function ServiceCategorySelector({ categories, selectedCategoryUuid, onSelect, }: ServiceCategorySelectorProps) {
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
    <span className="text-[10px] font-semibold text-[#777789]">
        ALL
        </span>
        </div>

        <div className="flex min-w-0 flex-col text-left">
    <span className="text-[11px] font-semibold text-[#343447]">
        All Services
    </span>

    <span className="text-[9px] text-[#777789]">
        Show all services
    </span>
    </div>
    </button>

    {categories.map((category) => {
        const selected = selectedCategoryUuid === category.uuid;

        return (
            <button
                key={category.uuid}
        type="button"
        title={category.description || undefined}
        onClick={() => onSelect(category.uuid)}
        className={`flex h-14 shrink-0 items-center gap-2 rounded-md border px-3 transition-colors ${
            selected
                ? 'border-[#b9b9cc] bg-[#f5f5f8]'
                : 'border-transparent hover:bg-[#ededf2]'
        }`}
    >
        <div className="size-9 shrink-0 overflow-hidden rounded-md bg-[#d3d3df]">
            {category.picturePath ? (
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

        <div className="flex min-w-0 max-w-32 flex-col text-left">
        <span className="truncate text-[11px] font-semibold text-[#343447]">
            {category.name}
            </span>

            <span className="truncate text-[9px] text-[#777789]">
            {category.description || 'No description'}
            </span>
            </div>
            </button>
    );
    })}
    </div>
    </div>
);
}