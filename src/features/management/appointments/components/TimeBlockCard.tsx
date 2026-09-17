import { CalendarClock, Info } from 'lucide-react';

import type { TimeBlockResponse } from '../../../../models/time-block.ts';

import { formatTimeInTimeZone } from '../../user-view/utils/timezone.ts';

interface TimeBlockCardProps {
    timeBlock: TimeBlockResponse;
    organizationTimeZone: string;
}

export function TimeBlockCard({ timeBlock, organizationTimeZone }: TimeBlockCardProps) {
    const startTime = formatTimeInTimeZone(timeBlock.startAtUTC, organizationTimeZone);

    const endTime = formatTimeInTimeZone(timeBlock.endAtUTC, organizationTimeZone);

    return (
        <article className="overflow-hidden rounded-xl border border-[#d3d3df] bg-[#ededf2]">
            <div className="flex min-w-0 items-start gap-3 p-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white">
                    <CalendarClock className="size-4 text-[#777789]" strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-semibold text-[#343447]">Time Block</h3>

                        <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-medium text-[#777789]">
                            Unavailable
                        </span>
                    </div>

                    <p className="mt-0.5 text-[10px] text-[#777789]">
                        {startTime} – {endTime}
                    </p>

                    {timeBlock.reason ? (
                        <div className="mt-2 flex items-start gap-1.5">
                            <Info className="mt-0.5 size-3 shrink-0 text-[#777789]" />

                            <p className="text-[11px] leading-4 text-[#777789]">
                                {timeBlock.reason}
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        </article>
    );
}
