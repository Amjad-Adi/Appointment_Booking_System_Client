import { BriefcaseBusiness, CalendarPlus, Clock3, Info, Pencil, Tag, Tags } from 'lucide-react';
import { useNavigate } from 'react-router';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../../../../../../../@/components/ui/Tooltip.tsx';

import type { ServiceResponse } from '../../../../../../models/service.model.ts';

import { ActivationStatusRender } from '../../../../components/ActivationStatusRender.tsx';
import { BackButton } from '../../../../components/BackButton.tsx';
import { Button } from '../../../../../../components/Button.tsx';
import { EntityImage } from '../../../../../../components/EntityImage.tsx';
import { FavouriteButton } from '../../../../components/FavouriteButton.tsx';
import { RatingStars } from '../../../../components/RatingStars.tsx';
import { useCurrentUser } from '../../../../hooks/users-hook.ts';
import { useOrganization } from '../../../../hooks/organization-hook.ts';
import { Role } from '../../../../../../models/enums/roles.ts';
import { OrganizationSchedule } from '../../../../components/OrganizationSchedule.tsx';
import { ServiceReviews } from './ServiceReviews.tsx';

interface ServiceProfileProps {
    service: ServiceResponse;
    canEdit?: boolean;
    onEdit?: () => void;
}

export function ServiceProfile({ service, canEdit = false, onEdit }: ServiceProfileProps) {
    const categories = service.categories ?? [];
    const navigate = useNavigate();
    const { data: currentUser } = useCurrentUser();
    const { data: organization } = useOrganization(service.organizationUuid);

    const organizationTimeZone =
        organization?.location?.timezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone ||
        'UTC';

    const isCustomer = currentUser?.role === Role.CUSTOMER;
    const isSuperAdmin = currentUser?.role === Role.SUPER_ADMIN;

    const backPath = isCustomer
        ? '/customer/services'
        : isSuperAdmin
          ? '/admin/services'
          : '/organization/services';

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-4">
            {/* Actions */}
            <div className="flex min-w-0 items-center justify-between gap-3">
                <BackButton backPath={backPath} />

                {isCustomer ? (
                    <div className="flex items-center gap-2">
                        <FavouriteButton
                            serviceUuid={service.uuid}
                            isFavourite={service.isFavourite}
                        />

                        <Button
                            type="button"
                            onClick={() => navigate(`${service.uuid}/book`)}
                            className="flex h-8 items-center gap-1.5 px-3 text-[11px]"
                        >
                            <CalendarPlus className="size-3.5" strokeWidth={1.8} />
                            Book Appointment
                        </Button>
                    </div>
                ) : canEdit && onEdit ? (
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
            <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="relative h-40 bg-card">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <EntityImage
                            src={service.servicePicturePath}
                            alt={service.name}
                            icon={BriefcaseBusiness}
                            className="flex size-24 items-center justify-center overflow-hidden rounded-2xl border border-border bg-secondary text-muted-foreground shadow-sm"
                            iconClassName="size-10"
                            strokeWidth={1.5}
                        />
                    </div>

                    <div className="absolute top-3 right-3 rounded-full border border-border bg-card px-2.5 py-1 shadow-sm">
                        {ActivationStatusRender({
                            status: service.status,
                        })}
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex min-w-0 flex-col gap-2">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <h1 className="min-w-0 truncate text-xl font-semibold text-foreground">
                                {service.name}
                            </h1>

                            <span className="text-[11px] text-muted-foreground">Service</span>
                        </div>

                        <p className="max-w-3xl text-[12px] leading-5 text-muted-foreground">
                            {service.description || 'No description available.'}
                        </p>

                        <RatingStars
                            value={service.averageRating ?? 0}
                            count={service.reviewCount}
                            size="md"
                        />
                    </div>
                </div>
            </section>

            {/* Service information */}
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-secondary">
                            <span className="text-[10px] font-semibold text-muted-foreground">$</span>
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                                Price
                            </p>

                            <p className="mt-0.5 text-lg font-semibold text-foreground">
                                {service.price}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-secondary">
                            <Clock3 className="size-4 text-muted-foreground" strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                                Duration
                            </p>

                            <p className="mt-0.5 text-lg font-semibold text-foreground">
                                {service.durationInMinutes} min
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Categories */}
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-secondary">
                        <Tag className="size-4 text-muted-foreground" strokeWidth={1.8} />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-foreground">Categories</h2>

                        <p className="text-[10px] text-muted-foreground">
                            Categories assigned to this service
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    {categories.length > 0 ? (
                        categories.map((category) => {
                            const hasDescription = Boolean(category.description?.trim());

                            const categoryContent = (
                                <div className="flex h-16 w-52 items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2">
                                    <EntityImage
                                        src={category.picturePath}
                                        alt={category.name}
                                        icon={Tags}
                                        className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground"
                                        iconClassName="size-4"
                                    />

                                    <div className="flex min-w-0 flex-1 items-center justify-between gap-1">
                                        <span className="min-w-0 truncate text-[11px] font-semibold text-foreground">
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
                        <p className="text-[11px] text-muted-foreground">No categories assigned.</p>
                    )}
                </div>
            </section>

            <OrganizationSchedule
                organizationUuid={service.organizationUuid}
                timeZone={organizationTimeZone}
            />

            <ServiceReviews
                serviceUuid={service.uuid}
                averageRating={service.averageRating ?? 0}
                reviewCount={service.reviewCount ?? 0}
            />
        </div>
    );
}
