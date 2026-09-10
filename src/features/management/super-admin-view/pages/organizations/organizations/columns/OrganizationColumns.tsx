import type { OrganizationResponse } from '../../../../../../../models/organization.model.ts';
import type { DataTableColumn } from '../../../../../../../components/DataTableFeatures.ts';
import { Button } from '../../../../../../../components/Button.tsx';
import { Building2, Info, MapPin, MoreHorizontalIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../../../../../../components/DropdownMenu.tsx';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../../../../../../../../@/components/ui/tooltip.tsx';

import { ActivationStatusRender } from '../../../../../components/ActivationStatusRender.tsx';

export const ORGANIZATION_TABLE_COLUMN = {
    NAME: 'name',
    EMAIL: 'email',
    PHONE_NUMBER: 'phoneNumber',
    LOCATION: 'location',
    PROFILE_PICTURE: 'profilePicturePath',
    CREATED_AT: 'createdAtUTC',
    STATUS: 'status',
    ACTIONS: 'actions',
} as const;

export const ORGANIZATION_TABLE_HEADER = {
    NAME: 'Name',
    EMAIL: 'Email',
    PHONE_NUMBER: 'Phone Number',
    LOCATION: 'Location',
    PROFILE_PICTURE: 'Profile',
    CREATED_AT: 'Created At',
    STATUS: 'Status',
    ACTIONS: 'Actions',
} as const;

export function getOrganizationColumns(
    onEdit: (organization: OrganizationResponse) => void,
): DataTableColumn<OrganizationResponse>[] {
    return [
        {
            accessorKey: ORGANIZATION_TABLE_COLUMN.STATUS,
            header: ORGANIZATION_TABLE_HEADER.STATUS,
            enableSorting: false,
            cell: ({ row }) => {
                return ActivationStatusRender({
                    status: row.original.status,
                });
            },
        },
        {
            accessorKey: ORGANIZATION_TABLE_COLUMN.NAME,
            header: ORGANIZATION_TABLE_HEADER.NAME,
            cell: ({ row }) => <OrganizationName name={row.original.name} bio={row.original.bio} />,
        },
        {
            accessorKey: ORGANIZATION_TABLE_COLUMN.EMAIL,
            header: ORGANIZATION_TABLE_HEADER.EMAIL,
            enableSorting: false,
        },
        {
            accessorKey: ORGANIZATION_TABLE_COLUMN.PHONE_NUMBER,
            header: ORGANIZATION_TABLE_HEADER.PHONE_NUMBER,
            enableSorting: false,
        },
        {
            accessorKey: ORGANIZATION_TABLE_COLUMN.LOCATION,
            header: ORGANIZATION_TABLE_HEADER.LOCATION,
            enableSorting: false,
            cell: ({ row }) => <OrganizationLocation location={row.original.location} />,
        },
        {
            accessorKey: ORGANIZATION_TABLE_COLUMN.PROFILE_PICTURE,
            header: ORGANIZATION_TABLE_HEADER.PROFILE_PICTURE,
            enableSorting: false,
            cell: () => <OrganizationProfilePicture />,
        },
        {
            accessorKey: ORGANIZATION_TABLE_COLUMN.CREATED_AT,
            header: ORGANIZATION_TABLE_HEADER.CREATED_AT,
            cell: ({ row }) => {
                return new Date(row.original.createdAtUTC).toLocaleDateString();
            },
        },
        {
            id: ORGANIZATION_TABLE_COLUMN.ACTIONS,
            header: ORGANIZATION_TABLE_HEADER.ACTIONS,
            enableSorting: false,
            cell: ({ row }) => <OrganizationActions organization={row.original} onEdit={onEdit} />,
        },
    ];
}

function OrganizationName({ name, bio }: { name: string; bio: string }) {
    const hasBio = Boolean(bio?.trim());

    if (!hasBio) {
        return <span className="block max-w-48 truncate">{name}</span>;
    }

    return (
        <Tooltip>
            <div className="flex w-full max-w-48 items-center justify-between gap-1">
                <span className="min-w-0 truncate">{name}</span>

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
                {bio}
            </TooltipContent>
        </Tooltip>
    );
}

function OrganizationLocation({ location }: { location: OrganizationResponse['location'] }) {
    if (!location) {
        return <span className="text-slate-400">—</span>;
    }

    const [longitude, latitude] = location.locationOnMap;

    const hasCoordinates = longitude !== null && latitude !== null;

    const googleMapsUrl = hasCoordinates
        ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
        : location.name
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name)}`
          : null;

    return (
        <div className="flex items-center gap-2">
            {googleMapsUrl && (
                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary inline-flex size-6 shrink-0 items-center justify-center text-slate-500"
                    aria-label={`Open ${location.name ?? 'location'} in Google Maps`}
                >
                    <MapPin className="size-4" />
                </a>
            )}

            <span className="max-w-36 truncate" title={location.name ?? undefined}>
                {location.name ?? 'Unknown'}
            </span>
        </div>
    );
}

function OrganizationProfilePicture() {
    return (
        <div className="flex items-center">
            <Building2 className="size-6 text-slate-500" />
        </div>
    );
}

function OrganizationActions({
    organization,
    onEdit,
}: {
    organization: OrganizationResponse;
    onEdit: (organization: OrganizationResponse) => void;
}) {
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <div className="group">
                <DropdownMenuTrigger
                    render={
                        <Button
                            type="button"
                            className="size-6 min-h-0 min-w-0 !border-transparent !bg-transparent p-0 text-slate-600 transition-transform duration-200 group-hover:-translate-y-0.5 hover:!bg-transparent sm:h-6 sm:w-6 sm:px-0 md:h-6 md:w-6"
                        >
                            <MoreHorizontalIcon className="size-4 shrink-0" />

                            <span className="sr-only">Open menu</span>
                        </Button>
                    }
                />
            </div>

            <DropdownMenuContent className="flex flex-col justify-end p-1">
                <DropdownMenuItem
                    className="h-7 px-2 text-[11px]"
                    onClick={() => onEdit(organization)}
                >
                    Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="h-7 px-2 text-[11px]"
                    onClick={() => navigate(`/admin/organizations/${organization.uuid}`)}
                >
                    View Profile
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
