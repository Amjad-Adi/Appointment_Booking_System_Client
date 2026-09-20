import { useNavigate } from 'react-router';
import { BriefcaseBusiness, Clock3, Eye, Info, Pencil } from 'lucide-react';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../../../../../../../@/components/ui/Tooltip.tsx';

import type { ServiceResponse } from '../../../../../../models/service.model.ts';

import { Button } from '../../../../../../components/Button.tsx';
import { ActivationStatusRender } from '../../../../components/ActivationStatusRender.tsx';

interface ServiceCardProps {
    service: ServiceResponse;
    canEdit?: boolean;
    onEdit?: (service: ServiceResponse) => void;
}

export function ServiceCard({ service, canEdit = false, onEdit }: ServiceCardProps) {
    const navigate = useNavigate();

    const hasDescription = Boolean(service.description?.trim());

    const serviceContent = (
        <>
            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#ededf2]">
                {service.profilePicturePath &&
                service.profilePicturePath !== 'DEFAULT_PICTURE_PATH' ? (
                    <img
                        src={service.profilePicturePath}
                        alt={service.name}
                        className="size-full object-cover"
                    />
                ) : (
                    <BriefcaseBusiness className="size-6 text-[#777789]" strokeWidth={1.8} />
                )}
            </div>

            <div className="absolute top-2 right-2 rounded-full bg-white/95 px-2 py-1 shadow-sm">
                {ActivationStatusRender({
                    status: service.status,
                })}
            </div>

            <div className="flex min-h-0 flex-1 flex-col p-4">
                <div className="flex min-w-0 items-center gap-1.5">
                    <h3 className="min-w-0 truncate text-sm font-semibold text-[#343447]">
                        {service.name}
                    </h3>

                    {hasDescription ? (
                        <TooltipTrigger
                            render={
                                <span className="shrink-0 cursor-default">
                                    <Info className="size-3.5 text-[#777789]" strokeWidth={1.8} />
                                </span>
                            }
                        />
                    ) : null}
                </div>

                <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-[#343447]">
                            {service.price}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[#777789]">
                        <Clock3 className="size-3.5" strokeWidth={1.8} />

                        <span className="text-[11px]">{service.durationInMinutes} min</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-[#ededf2] pt-3">
                    <Button
                        type="button"
                        onClick={() => navigate(`${service.uuid}`)}
                        className="flex h-8 flex-1 items-center justify-center gap-1.5 px-3 text-[11px]"
                    >
                        <Eye className="size-3.5" strokeWidth={1.8} />
                        View Service
                    </Button>

                    {canEdit && onEdit ? (
                        <Button
                            type="button"
                            onClick={() => onEdit(service)}
                            className="flex h-8 w-8 min-w-8 items-center justify-center bg-[#ededf2] p-0 text-[#343447] hover:bg-[#d3d3df]"
                            aria-label={`Edit ${service.name}`}
                        >
                            <Pencil className="size-3.5" strokeWidth={1.8} />
                        </Button>
                    ) : null}
                </div>
            </div>
        </>
    );

    if (!hasDescription) {
        return (
            <article className="relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#d3d3df] bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
                {serviceContent}
            </article>
        );
    }

    return (
        <Tooltip>
            <article className="relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#d3d3df] bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
                {serviceContent}
            </article>

            <TooltipContent
                side="top"
                align="center"
                className="max-w-xs text-[11px] leading-4 whitespace-normal"
            >
                {service.description}
            </TooltipContent>
        </Tooltip>
    );
}
