import { CalendarClock, CircleDollarSign, Info, MapPin, UserRound } from 'lucide-react';

import type { AppointmentResponse } from '../../../../models/appointment.model.ts';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../../../../../@/components/ui/Tooltip.tsx';

interface AppointmentCardProps {
    appointment: AppointmentResponse;
    onClick?: (appointment: AppointmentResponse) => void;
}

function formatTime(value: string) {
    return new Date(value).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
    const hasOrganizationNote = Boolean(appointment.organizationNote?.trim());

    const startTime = formatTime(appointment.scheduledStartAtUTC);
    const endTime = formatTime(appointment.scheduledEndAtUTC);

    return (
        <article
            className="relative flex min-w-0 cursor-pointer overflow-hidden rounded-xl border border-[#d3d3df] bg-white shadow-sm transition-shadow hover:shadow-md"
            onClick={() => onClick?.(appointment)}
        >
            <div
                className="w-1 shrink-0"
                style={{
                    backgroundColor: appointment.organizationColour || '#2563EB',
                }}
            />

            <div className="flex min-w-0 flex-1 flex-col gap-3 p-3">
                <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-1.5">
                            <h3 className="truncate text-sm font-semibold text-[#343447]">
                                {appointment.serviceName}
                            </h3>

                            {hasOrganizationNote ? (
                                <Tooltip>
                                    <TooltipTrigger
                                        render={
                                            <span
                                                className="shrink-0 cursor-default"
                                                onClick={(event) => event.stopPropagation()}
                                            >
                                                <Info
                                                    className="size-3.5 text-[#777789]"
                                                    strokeWidth={1.8}
                                                />
                                            </span>
                                        }
                                    />

                                    <TooltipContent
                                        side="top"
                                        align="center"
                                        className="max-w-xs text-[11px] leading-4 whitespace-normal"
                                    >
                                        {appointment.organizationNote}
                                    </TooltipContent>
                                </Tooltip>
                            ) : null}
                        </div>

                        <p className="mt-0.5 text-[10px] text-[#777789]">{appointment.name}</p>
                    </div>

                    <span className="shrink-0 rounded-full bg-[#ededf2] px-2 py-1 text-[9px] font-medium text-[#343447]">
                        {appointment.appointmentStatus}
                    </span>
                </div>

                <div className="grid min-w-0 grid-cols-1 gap-1.5 text-[11px] text-[#777789] sm:grid-cols-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                        <CalendarClock className="size-3.5 shrink-0" />

                        <span className="truncate">
                            {startTime} – {endTime}
                        </span>
                    </div>

                    <div className="flex min-w-0 items-center gap-1.5">
                        <UserRound className="size-3.5 shrink-0" />

                        <span className="truncate">{appointment.userName}</span>
                    </div>

                    <div className="flex min-w-0 items-center gap-1.5">
                        <MapPin className="size-3.5 shrink-0" />

                        <span className="truncate">{appointment.roomName}</span>
                    </div>

                    <div className="flex min-w-0 items-center gap-1.5">
                        <CircleDollarSign className="size-3.5 shrink-0" />

                        <span className="truncate">{appointment.paymentStatus}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
