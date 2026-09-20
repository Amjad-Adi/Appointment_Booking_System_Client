import { BriefcaseBusiness, Clock3, Info, Pencil, Tag } from 'lucide-react';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../../../../../../../@/components/ui/Tooltip.tsx';

import type { ServiceResponse } from '../../../../../../models/service.model.ts';

import { ActivationStatusRender } from '../../../../components/ActivationStatusRender.tsx';
import { BackButton } from '../../../../components/BackButton.tsx';
import { Button } from '../../../../../../components/Button.tsx';

interface ServiceProfileProps {
    service: ServiceResponse;
    canEdit?: boolean;
    onEdit?: () => void;
}

export function ServiceProfile({ service, canEdit = false, onEdit }: ServiceProfileProps) {
    const categories = service.categories ?? [];

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-4">
            {/* Actions */}
            <div className="flex min-w-0 items-center justify-between gap-3">
                <BackButton backPath="/organization/services" />

                {canEdit && onEdit ? (
                    <Button
                        type="button"
                        onClick={onEdit}
                        className="flex h-8 items-center gap-1.5 px-3 text-[11px]"
                    >
                        <Pencil className="size-3.5" strokeWidth={1.8} />
                        Edit
                    </Button>
                ) : null}
            </div>

            {/* Service header */}
            <section className="overflow-hidden rounded-xl border border-[#d3d3df] bg-white shadow-sm">
                <div className="relative h-40 bg-[#f5f5f8]">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex size-24 items-center justify-center overflow-hidden rounded-2xl border border-[#d3d3df] bg-[#ededf2] shadow-sm">
                            {service.profilePicturePath &&
                            service.profilePicturePath !== 'DEFAULT_PICTURE_PATH' ? (
                                <img
                                    src={service.profilePicturePath}
                                    alt={service.name}
                                    className="size-full object-cover"
                                />
                            ) : (
                                <BriefcaseBusiness
                                    className="size-10 text-[#777789]"
                                    strokeWidth={1.5}
                                />
                            )}
                        </div>
                    </div>

                    <div className="absolute top-3 right-3 rounded-full border border-[#d3d3df] bg-white px-2.5 py-1 shadow-sm">
                        {ActivationStatusRender({
                            status: service.status,
                        })}
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex min-w-0 flex-col gap-2">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <h1 className="min-w-0 truncate text-xl font-semibold text-[#343447]">
                                {service.name}
                            </h1>

                            <span className="text-[11px] text-[#777789]">Service</span>
                        </div>

                        <p className="max-w-3xl text-[12px] leading-5 text-[#777789]">
                            {service.description || 'No description available.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Service information */}
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <section className="rounded-xl border border-[#d3d3df] bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#ededf2]">
                            <span className="text-[10px] font-semibold text-[#777789]">$</span>
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium tracking-wide text-[#777789] uppercase">
                                Price
                            </p>

                            <p className="mt-0.5 text-lg font-semibold text-[#343447]">
                                {service.price}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-[#d3d3df] bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#ededf2]">
                            <Clock3 className="size-4 text-[#777789]" strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium tracking-wide text-[#777789] uppercase">
                                Duration
                            </p>

                            <p className="mt-0.5 text-lg font-semibold text-[#343447]">
                                {service.durationInMinutes} min
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Categories */}
            <section className="rounded-xl border border-[#d3d3df] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#ededf2]">
                        <Tag className="size-4 text-[#777789]" strokeWidth={1.8} />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-[#343447]">Categories</h2>

                        <p className="text-[10px] text-[#777789]">
                            Categories assigned to this service
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    {categories.length > 0 ? (
                        categories.map((category) => {
                            const hasDescription = Boolean(category.description?.trim());

                            const categoryContent = (
                                <div className="flex h-16 w-52 items-center gap-2 rounded-lg border border-[#d3d3df] bg-[#f5f5f8] px-2.5 py-2">
                                    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#d3d3df]">
                                        {category.picturePath &&
                                        category.picturePath !== 'DEFAULT_PICTURE_PATH' ? (
                                            <img
                                                src={category.picturePath}
                                                alt={category.name}
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-[10px] font-semibold text-[#777789]">
                                                {category.name?.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex min-w-0 flex-1 items-center justify-between gap-1">
                                        <span className="min-w-0 truncate text-[11px] font-semibold text-[#343447]">
                                            {category.name}
                                        </span>

                                        {hasDescription ? (
                                            <TooltipTrigger
                                                render={
                                                    <span className="shrink-0 cursor-default">
                                                        <Info
                                                            className="size-3.5"
                                                            strokeWidth={1.8}
                                                        />
                                                    </span>
                                                }
                                            />
                                        ) : null}
                                    </div>
                                </div>
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
                        })
                    ) : (
                        <p className="text-[11px] text-[#777789]">No categories assigned.</p>
                    )}
                </div>
            </section>
        </div>
    );
}
