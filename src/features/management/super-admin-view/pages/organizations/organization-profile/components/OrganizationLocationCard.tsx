import { ExternalLink, MapPin } from 'lucide-react';

import type { OrganizationResponse } from '../../../../../../../models/organization.model.ts';

interface OrganizationLocationCardProps {
    location: OrganizationResponse['location'];
}

export function OrganizationLocationCard({ location }: OrganizationLocationCardProps) {
    if (!location) {
        return (
            <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
                <CardHeader />

                <div className="mt-5 text-[11px] text-[#777789]">
                    No location information available.
                </div>
            </section>
        );
    }

    const [longitude, latitude] = location.locationOnMap;

    const hasCoordinates = longitude !== null && latitude !== null;

    const googleMapsUrl = hasCoordinates
        ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
        : location.name
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name)}`
          : null;

    return (
        <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
            <CardHeader />

            <div className="mt-5 flex min-w-0 items-center gap-3 rounded-lg border border-[#d3d3df] bg-[#ededf2] p-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#f5f5f8] text-[#777789]">
                    <MapPin className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                    <p
                        className="truncate text-[12px] font-semibold text-[#343447]"
                        title={location.name ?? undefined}
                    >
                        {location.name || 'Unknown'}
                    </p>

                    <p className="mt-1 text-[10px] text-[#777789]">Organization location</p>
                </div>

                {googleMapsUrl && (
                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex size-7 shrink-0 items-center justify-center rounded-md border border-[#d3d3df] bg-[#f5f5f8] text-[#777789] transition-colors hover:bg-[#e5e6ec] hover:text-[#343447]"
                        aria-label={`Open ${location.name ?? 'location'} in Google Maps`}
                    >
                        <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </a>
                )}
            </div>
        </section>
    );
}

function CardHeader() {
    return (
        <div>
            <h3 className="text-[13px] font-semibold text-[#343447]">Location</h3>

            <p className="mt-0.5 text-[10px] leading-4 text-[#777789]">
                Location associated with this organization.
            </p>
        </div>
    );
}
