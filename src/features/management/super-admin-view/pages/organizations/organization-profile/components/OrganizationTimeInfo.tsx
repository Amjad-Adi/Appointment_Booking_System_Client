import { useEffect, useState } from 'react';
import { Clock3, Globe2 } from 'lucide-react';

import {
    formatDateTimeInTimeZone,
    getTimeZoneName,
} from '../../../../../user-view/utils/timezone.ts';

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
        <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-card">
                    <Globe2 className="size-3.5 text-muted-foreground" strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-left text-[10px] font-semibold text-foreground">
                        Organization Time
                    </p>

                    <p className="truncate text-left text-[9px] text-muted-foreground">
                        {timeZone}
                        {getTimeZoneName(timeZone)}
                    </p>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
                <Clock3 className="size-3 text-muted-foreground" strokeWidth={1.8} />

                <span className="text-[10px] font-medium text-foreground tabular-nums">
                    {formatDateTimeInTimeZone(now, timeZone)}
                </span>
            </div>
        </div>
    );
}
