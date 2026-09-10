import { ChevronDown, FileText } from 'lucide-react';
import { useState } from 'react';

import type { OrganizationResponse } from '../../../../../../../models/organization.model.ts';

interface OrganizationBioCardProps {
    bio: OrganizationResponse['bio'];
}

export function OrganizationBioCard({ bio }: OrganizationBioCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const hasBio = Boolean(bio?.trim());

    return (
        <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
            <button
                type="button"
                onClick={() => setIsExpanded((previous) => !previous)}
                className="group flex w-full min-w-0 cursor-pointer items-center justify-between gap-3 text-left"
                aria-expanded={isExpanded}
            >
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#ededf2] text-[#777789]">
                        <FileText className="size-4" />
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-[13px] font-semibold text-[#343447]">Bio</h3>

                        <p className="mt-0.5 text-[10px] leading-4 text-[#777789]">
                            Organization description and additional information.
                        </p>
                    </div>
                </div>

                <ChevronDown
                    className={`size-4 shrink-0 text-[#777789] transition-transform duration-200 group-hover:text-[#343447] ${
                        isExpanded ? 'rotate-180' : ''
                    }`}
                />
            </button>
            {isExpanded && (
                <div className="mt-5 border-t border-[#d3d3df] pt-4">
                    <p className="text-[11px] leading-5 font-medium break-words whitespace-pre-wrap text-[#454556]">
                        {hasBio ? bio : 'No bio information available.'}
                    </p>
                </div>
            )}

            {!isExpanded && hasBio && (
                <p className="mt-4 truncate text-[11px] font-medium text-[#454556]">{bio}</p>
            )}

            {!isExpanded && !hasBio && (
                <p className="mt-4 text-[11px] text-[#777789]">No bio information available.</p>
            )}
        </section>
    );
}
