import { useNavigate } from 'react-router';
import { BriefcaseBusiness, Clock3, Eye, Info, Pencil } from 'lucide-react';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../../../../../../../@/components/ui/Tooltip.tsx';

import type { ServiceResponse } from '../../../../../../models/service.model.ts';

import { Button } from '../../../../../../components/Button.tsx';
import { EntityImage } from '../../../../../../components/EntityImage.tsx';
import { ActivationStatusRender } from '../../../../components/ActivationStatusRender.tsx';
import { FavouriteButton } from '../../../../components/FavouriteButton.tsx';
import { RatingStars } from '../../../../components/RatingStars.tsx';

interface ServiceCardProps {
    service: ServiceResponse;
    canEdit?: boolean;
    canBook?: boolean;
    canFavourite?: boolean;
    onEdit?: (service: ServiceResponse) => void;
}

export function ServiceCard({
    service,
    canEdit = false,
    canBook = false,
    canFavourite = false,
    onEdit,
}: ServiceCardProps) {
    const navigate = useNavigate();

    const hasDescription = Boolean(service.description?.trim());

    const serviceContent = (
        <>
            <EntityImage
                src={service.servicePicturePath}
                alt={service.name}
                icon={BriefcaseBusiness}
                className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary text-muted-foreground"
                iconClassName="size-6"
            />

            <div className="absolute top-2 right-2 rounded-full bg-popover/95 px-2 py-1 shadow-sm">
                {ActivationStatusRender({
                    status: service.status,
                })}
            </div>

            <div className="flex min-h-0 flex-1 flex-col p-4">
                <div className="flex min-w-0 items-center gap-1.5">
                    <h3 className="min-w-0 truncate text-sm font-semibold text-foreground">
                        {service.name}
                    </h3>

                    {hasDescription ? (
                        <TooltipTrigger
                            render={
                                <span className="shrink-0 cursor-default">
                                    <Info className="size-3.5 text-muted-foreground" strokeWidth={1.8} />
                                </span>
                            }
                        />
                    ) : null}

                    {canFavourite ? (
                        <FavouriteButton
                            serviceUuid={service.uuid}
                            isFavourite={service.isFavourite}
                            className="ml-auto size-7"
                        />
                    ) : null}
                </div>

                <div className="mt-2">
                    <RatingStars value={service.averageRating ?? 0} count={service.reviewCount} />
                </div>

                <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-foreground">
                            {service.price}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock3 className="size-3.5" strokeWidth={1.8} />

                        <span className="text-[11px]">{service.durationInMinutes} min</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                    <Button
                        type="button"
                        onClick={() =>
                            navigate(canBook ? `${service.uuid}/book` : `${service.uuid}`)
                        }
                        className="flex h-8 flex-1 items-center justify-center gap-1.5 px-3 text-[11px]"
                    >
                        <Eye className="size-3.5" strokeWidth={1.8} />
                        {canBook ? 'Book Now' : 'View Service'}
                    </Button>

                    {canEdit && onEdit ? (
                        <Button
                            type="button"
                            onClick={() => onEdit(service)}
                            className="flex h-8 w-8 min-w-8 items-center justify-center bg-secondary p-0 text-foreground hover:bg-muted"
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
            <article className="relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
                {serviceContent}
            </article>
        );
    }

    return (
        <Tooltip>
            <article className="relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
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
