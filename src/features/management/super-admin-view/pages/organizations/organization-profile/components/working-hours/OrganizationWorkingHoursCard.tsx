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
        <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
                <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#ededf2] text-[#777789]">
                        <CalendarClock className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-[13px] font-semibold text-[#343447]">Working Hours</h3>
                        <p className="mt-0.5 text-[10px] leading-4 text-[#777789]">
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
