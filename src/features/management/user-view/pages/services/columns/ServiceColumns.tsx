import type { ServiceResponse } from '../../../../../../models/service.model.ts';
import type { DataTableColumn } from '../../../../../../components/DataTableFeatures.ts';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../../../../../components/DropdownMenu.tsx';

import { BriefcaseBusiness, Info, MoreHorizontalIcon } from 'lucide-react';

import { useNavigate } from 'react-router';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../../../../../../../@/components/ui/Tooltip.tsx';

import { Button } from '../../../../../../components/Button.tsx';
import { EntityImage } from '../../../../../../components/EntityImage.tsx';
import { ActivationStatusRender } from '../../../../components/ActivationStatusRender.tsx';
import { FavouriteButton } from '../../../../components/FavouriteButton.tsx';
import { RatingStars } from '../../../../components/RatingStars.tsx';

export const SERVICE_TABLE_COLUMN = {
    STATUS: 'status',
    NAME: 'name',
    PRICE: 'price',
    DURATION: 'durationInMinutes',
    CREATED_AT: 'createdAtUTC',
    ACTIONS: 'actions',
};

export const SERVICE_TABLE_HEADER = {
    STATUS: 'Status',
    NAME: 'Service',
    PRICE: 'Price',
    DURATION: 'Duration',
    CREATED_AT: 'Created At',
    ACTIONS: 'Actions',
};

export function getServiceColumns(
    onEdit?: (service: ServiceResponse) => void,
    canFavourite = false,
): DataTableColumn<ServiceResponse>[] {
    return [
        ...(canFavourite
            ? [
                  {
                      id: 'favourite',
                      header: '',
                      enableSorting: false,
                      cell: ({ row }: { row: { original: ServiceResponse } }) => (
                          <FavouriteButton
                              serviceUuid={row.original.uuid}
                              isFavourite={row.original.isFavourite}
                          />
                      ),
                  } as DataTableColumn<ServiceResponse>,
              ]
            : []),
        {
            id: 'rating',
            header: 'Rating',
            enableSorting: false,
            cell: ({ row }) => (
                <RatingStars value={row.original.averageRating ?? 0} count={row.original.reviewCount} />
            ),
        },
        {
            accessorKey: SERVICE_TABLE_COLUMN.STATUS,
            header: SERVICE_TABLE_HEADER.STATUS,
            enableSorting: false,
            cell: ({ row }) => {
                return ActivationStatusRender({
                    status: row.original.status,
                });
            },
        },
        {
            accessorKey: SERVICE_TABLE_COLUMN.NAME,
            header: SERVICE_TABLE_HEADER.NAME,
            cell: ({ row }) => <ServiceName service={row.original} />,
        },
        {
            accessorKey: SERVICE_TABLE_COLUMN.PRICE,
            header: SERVICE_TABLE_HEADER.PRICE,
            cell: ({ row }) => {
                return row.original.price;
            },
        },
        {
            accessorKey: SERVICE_TABLE_COLUMN.DURATION,
            header: SERVICE_TABLE_HEADER.DURATION,
            cell: ({ row }) => {
                return `${row.original.durationInMinutes} min`;
            },
        },
        {
            accessorKey: SERVICE_TABLE_COLUMN.CREATED_AT,
            header: SERVICE_TABLE_HEADER.CREATED_AT,
            cell: ({ row }) => {
                return new Date(row.original.createdAtUTC).toLocaleDateString();
            },
        },
        {
            id: SERVICE_TABLE_COLUMN.ACTIONS,
            header: SERVICE_TABLE_HEADER.ACTIONS,
            enableSorting: false,
            cell: ({ row }) => <ServiceActions service={row.original} onEdit={onEdit} />,
        },
    ];
}

function ServiceName({ service }: { service: ServiceResponse }) {
    const hasDescription = Boolean(service.description?.trim());

    return (
        <div className="flex min-w-0 items-center gap-2">
            <EntityImage
                src={service.servicePicturePath}
                alt={service.name}
                icon={BriefcaseBusiness}
                className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-secondary text-muted-foreground"
                iconClassName="size-4"
            />

            {hasDescription ? (
                <Tooltip>
                    <div className="flex w-full max-w-48 items-center justify-between gap-1">
                        <span className="min-w-0 truncate">{service.name}</span>

                        <TooltipTrigger
                            render={
                                <span className="shrink-0 cursor-default">
                                    <Info className="size-3.5" />
                                </span>
                            }
                        />
                    </div>

                    <TooltipContent
                        side="top"
                        align="center"
                        className="max-w-xs text-[11px] leading-4 whitespace-normal"
                    >
                        {service.description}
                    </TooltipContent>
                </Tooltip>
            ) : (
                <span className="block max-w-48 truncate">{service.name}</span>
            )}
        </div>
    );
}

function ServiceActions({
    service,
    onEdit,
}: {
    service: ServiceResponse;
    onEdit?: (service: ServiceResponse) => void;
}) {
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <div className="group">
                <DropdownMenuTrigger
                    render={
                        <Button
                            type="button"
                            className="size-6 min-h-0 min-w-0 !border-transparent !bg-transparent p-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 hover:!bg-transparent sm:h-6 sm:w-6 sm:px-0 md:h-6 md:w-6"
                        >
                            <MoreHorizontalIcon className="size-4 shrink-0" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    }
                />
            </div>

            <DropdownMenuContent className="flex flex-col justify-end p-1">
                {onEdit && (
                    <DropdownMenuItem
                        className="h-7 px-2 text-[11px]"
                        onClick={() => onEdit(service)}
                    >
                        Edit
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem
                    className="h-7 px-2 text-[11px]"
                    onClick={() => navigate(`${service.uuid}`)}
                >
                    View Service
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
