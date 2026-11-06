import { useState } from 'react';
import { CalendarClock, Pencil } from 'lucide-react';

import type { OrganizationResponse } from '../../../../../../../../models/organization.model.ts';
import { useOrganizationWorkingHours } from '../../../../../../hooks/working-hours-hook.ts';
import { Button } from '../../../../../../../../components/Button.tsx';

import { WorkingHoursTable } from './WorkingHoursTable.tsx';

interface OrganizationWorkingHoursCardProps {
    organization: OrganizationResponse;
    canEdit?: boolean;
}

export function OrganizationWorkingHoursCard({
    organization,
    canEdit = false,
}: OrganizationWorkingHoursCardProps) {
    const { data: workingHoursData } = useOrganizationWorkingHours(organization.uuid, {
        limit: 7,
        page: 1,
        sortBy: 'dayOfWeek',
    });

    const [isWeekDialogOpen, setIsWeekDialogOpen] = useState(false);
    const workingHours = workingHoursData?.data ?? [];

    return (
        <section
            id="working-hours"
            className="min-w-0 scroll-mt-24 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6"
        >
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground">
                        <CalendarClock className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-[13px] font-semibold text-foreground">Working Hours</h3>
                        <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                            Weekly schedule and operating times.
                        </p>
                    </div>
                </div>
            </div>

            <WorkingHoursTable
                organizationUuid={organization.uuid}
                workingHours={workingHours}
                canEdit={canEdit}
            />
        </section>
    );
}
