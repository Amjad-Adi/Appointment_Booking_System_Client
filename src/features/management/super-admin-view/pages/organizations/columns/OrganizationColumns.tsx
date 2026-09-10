import type { OrganizationResponse } from '../../../../../../models/organization.model.ts';
import type { DataTableColumn } from '../../../../../../components/DataTableFeatures.ts';
import { Button } from '../../../../../../components/Button.tsx';
import { MapPin, MoreHorizontalIcon, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../../../../../components/DropdownMenu.tsx';

import { ActivationStatus } from '../../../../../../models/enums/activation-status.ts';

export const ORGANIZATION_TABLE_COLUMN = {
    NAME: 'name',
    EMAIL: 'email',
    PHONE_NUMBER: 'phoneNumber',
    BIO: 'bio',
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
    BIO: 'Bio',
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
            accessorKey: ORGANIZATION_TABLE_COLUMN.NAME,
            header: ORGANIZATION_TABLE_HEADER.NAME,
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
            accessorKey: ORGANIZATION_TABLE_COLUMN.BIO,
            header: ORGANIZATION_TABLE_HEADER.BIO,
            enableSorting: false,
            cell: ({ row }) => (
                <OrganizationBio bio={row.original.bio} />
            ),
        },
        {
            accessorKey: ORGANIZATION_TABLE_COLUMN.LOCATION,
            header: ORGANIZATION_TABLE_HEADER.LOCATION,
            enableSorting: false,
            cell: ({ row }) => (
                <OrganizationLocation
                    location={row.original.location}
                />
            ),
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
                return new Date(
                    row.original.createdAtUTC,
                ).toLocaleDateString();
            },
        },
        {
            accessorKey: ORGANIZATION_TABLE_COLUMN.STATUS,
            header: ORGANIZATION_TABLE_HEADER.STATUS,
            enableSorting: false,
            cell: ({ row }) => (
                <OrganizationStatus
                    status={row.original.status}
                />
            ),
        },
        {
            id: ORGANIZATION_TABLE_COLUMN.ACTIONS,
            header: ORGANIZATION_TABLE_HEADER.ACTIONS,
            enableSorting: false,
            cell: ({ row }) => (
                <OrganizationActions
                    organization={row.original}
                    onEdit={onEdit}
                />
            ),
        },
    ];
}

function OrganizationBio({ bio }: { bio: string }) {
    if (!bio) {
        return <span className="text-slate-400">—</span>;
    }

    return (
        <span
            className="block max-w-48 truncate"
            title={bio}
        >
            {bio}
        </span>
    );
}

function OrganizationLocation({
    location,
}: {
    location: OrganizationResponse['location'];
}) {
    if (!location) {
        return <span className="text-slate-400">—</span>;
    }

    const [longitude, latitude] = location.locationOnMap;

    const hasCoordinates =
        longitude !== null &&
        latitude !== null;

    const googleMapsUrl = hasCoordinates
        ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : location.name
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name)}`
    : null;

return (
    <div className="flex items-center gap-2">
            <span
                className="max-w-36 truncate"
                title={location.name ?? undefined}
            >
                {location.name ?? 'Unknown'}
            </span>

        {googleMapsUrl && (
            <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-6 shrink-0 items-center justify-center text-slate-500 hover:text-primary"
                aria-label={`Open ${location.name ?? 'location'} in Google Maps`}
            >
                <MapPin className="size-4" />
            </a>
        )}
    </div>
);
}

function OrganizationProfilePicture() {
    return (
        <div className="flex items-center">
            <UserCircle className="size-6 text-slate-500" />
        </div>
    );
}

function OrganizationStatus({
                                status,
                            }: {
    status: ActivationStatus;
}) {
    const isActive = status === ActivationStatus.ACTIVE;

    return (
        <div className="flex items-center justify-center">
            <span className="relative size-2.5">
                {isActive && (
                    <span className="absolute inset-0 size-2.5 rounded-full bg-emerald-500 opacity-15" />
                )}

                <span
                    className={`absolute inset-0 size-2.5 rounded-full ${
                        isActive
                            ? 'bg-emerald-500'
                            : 'bg-red-400'
                    }`}
                />
            </span>
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
                            <span className="sr-only">
                                Open menu
                            </span>
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
                    onClick={() =>
                        navigate(
                            `/organizations/${organization.uuid}`,
                        )
                    }
                >
                    View Profile
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
