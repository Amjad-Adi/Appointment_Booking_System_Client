import { Link } from 'react-router';
import { BriefcaseBusiness, Building2, Clock3, Eye, Info } from 'lucide-react';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../../../../../../../@/components/ui/Tooltip.tsx';

import type { FavouriteServiceResponse } from '../../../../../../models/favourite.model.ts';

import { EntityImage } from '../../../../../../components/EntityImage.tsx';
import { FavouriteButton } from '../../../../components/FavouriteButton.tsx';
import { RatingStars } from '../../../../components/RatingStars.tsx';

interface FavouriteServiceCardProps {
    favourite: FavouriteServiceResponse;
}

export function FavouriteServiceCard({ favourite }: FavouriteServiceCardProps) {
    const hasDescription = Boolean(favourite.description?.trim());

    const cardContent = (
        <article className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
            <div className="flex items-start gap-3 p-4 pb-0">
                <EntityImage
                    src={favourite.servicePicturePath}
                    alt={favourite.name}
                    icon={BriefcaseBusiness}
                    className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary text-muted-foreground"
                    iconClassName="size-6"
                />

                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex min-w-0 items-center gap-1.5">
                        <h3 className="min-w-0 truncate text-sm font-semibold text-foreground">
                            {favourite.name}
                        </h3>

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

                        <FavouriteButton
                            serviceUuid={favourite.uuid}
                            isFavourite
                            className="ml-auto size-7"
                        />
                    </div>

                    <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Building2 className="size-3.5 shrink-0" strokeWidth={1.8} />
                        <span className="truncate">{favourite.organizationName}</span>
                    </div>
                </div>
            </div>

            <div className="mt-3 flex flex-col gap-3 px-4">
                <RatingStars
                    value={favourite.averageRating ?? 0}
                    count={favourite.reviewCount}
                />

                <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-foreground">{favourite.price}</span>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock3 className="size-3.5" strokeWidth={1.8} />
                        <span className="text-[11px]">{favourite.durationInMinutes} min</span>
                    </div>
                </div>

                <p className="text-[10px] text-muted-foreground">
                    Saved on {new Date(favourite.favouritedAtUTC).toLocaleDateString()}
                </p>
            </div>

            <div className="mt-auto flex items-center gap-2 p-4 pt-3">
                <Link
                    to={`/customer/services/${favourite.uuid}`}
                    className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-transparent px-3 text-[11px] font-semibold text-secondary-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                    <Eye className="size-3.5" strokeWidth={1.8} />
                    View Service
                </Link>

                <Link
                    to={`/customer/services/${favourite.uuid}/book`}
                    className="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-primary px-3 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    Book Now
                </Link>
            </div>
        </article>
    );

    if (!hasDescription) {
        return cardContent;
    }

    return (
        <Tooltip>
            {cardContent}

            <TooltipContent
                side="top"
                align="center"
                className="max-w-xs text-[11px] leading-4 whitespace-normal"
            >
                {favourite.description}
            </TooltipContent>
        </Tooltip>
    );
}
