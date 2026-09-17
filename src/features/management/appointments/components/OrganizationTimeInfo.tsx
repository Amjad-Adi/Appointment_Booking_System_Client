import { useEffect, useState } from 'react';
import { Clock3, Globe2 } from 'lucide-react';

import { formatDateTimeInTimeZone, getTimeZoneName } from '../../user-view/utils/timezone.ts';

interface OrganizationTimeInfoProps {
    timeZone: string;
}

export function OrganizationTimeInfo({ timeZone }: OrganizationTimeInfoProps) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const interval = window.setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => {
            window.clearInterval(interval);
        };
    }, []);

    return (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-[#d3d3df] bg-[#f5f5f8] px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white">
                    <Globe2 className="size-3.5 text-[#777789]" strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-[10px] font-semibold text-[#343447]">
                        Organization Time
                    </p>

                    <p className="truncate text-[9px] text-[#777789]">
                        {timeZone}
                        {' · '}
                        {getTimeZoneName(timeZone)}
                    </p>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
                <Clock3 className="size-3 text-[#777789]" strokeWidth={1.8} />

                <span className="text-[10px] font-medium text-[#343447] tabular-nums">
                    {formatDateTimeInTimeZone(now, timeZone)}
                </span>
            </div>
        </div>
    );
}
