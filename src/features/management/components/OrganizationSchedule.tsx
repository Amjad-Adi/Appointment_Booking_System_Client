import { useMemo } from 'react';
import { CalendarClock, Clock3, Sparkles } from 'lucide-react';

import type { SpecialDay } from '../../../models/special-days.model.ts';
import { DayOfWeek } from '../../../models/enums/day-of-week.ts';
import { ActivationStatus } from '../../../models/enums/activation-status.ts';
import { Order } from '../../../models/enums/order.ts';

import { useOrganizationWorkingHours } from '../hooks/working-hours-hook.ts';
import { useOrganizationSpecialDays } from '../hooks/special-days-hook.ts';

const DAY_ORDER: DayOfWeek[] = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY,
];

const DAY_LABELS: Record<string, string> = {
    MONDAY: 'Mon',
    TUESDAY: 'Tue',
    WEDNESDAY: 'Wed',
    THURSDAY: 'Thu',
    FRIDAY: 'Fri',
    SATURDAY: 'Sat',
    SUNDAY: 'Sun',
};

function formatClockTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = Number(hours);

    if (Number.isNaN(hour) || !minutes) {
        return time;
    }

    const period = hour >= 12 ? 'PM' : 'AM';

    return `${hour % 12 || 12}:${minutes} ${period}`;
}

function getDatePartsInTimeZone(timeZone: string): { date: string; dayOfWeek: string } {
    try {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'long',
        }).formatToParts(new Date());

        const getPart = (type: string) => parts.find((part) => part.type === type)?.value ?? '';

        return {
            date: `${getPart('year')}-${getPart('month')}-${getPart('day')}`,
            dayOfWeek: getPart('weekday').toUpperCase(),
        };
    } catch {
        const now = new Date();

        return {
            date: now.toLocaleDateString('en-CA'),
            dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(),
        };
    }
}

function formatCalendarDate(dayDate: string): { weekday: string; label: string } {
    const [year, month, day] = dayDate.split('-').map(Number);

    if (!year || !month || !day) {
        return { weekday: '', label: dayDate };
    }

    // Calendar dates have no timezone: format them as UTC so the day never shifts.
    const value = new Date(Date.UTC(year, month - 1, day));

    return {
        weekday: new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'short' }).format(
            value,
        ),
        label: new Intl.DateTimeFormat('en-US', {
            timeZone: 'UTC',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(value),
    };
}

interface OrganizationScheduleProps {
    organizationUuid: string | undefined;
    timeZone: string;
    showWorkingHours?: boolean;
    showSpecialDays?: boolean;
    className?: string;
}

export function OrganizationSchedule({
    organizationUuid,
    timeZone,
    showWorkingHours = true,
    showSpecialDays = true,
    className,
}: OrganizationScheduleProps) {
    const workingHoursQuery = useOrganizationWorkingHours(
        showWorkingHours ? organizationUuid : undefined,
        { page: 1, limit: 7, sortBy: 'dayOfWeek' },
    );

    const specialDaysQuery = useOrganizationSpecialDays(
        showSpecialDays ? organizationUuid : undefined,
        {
            page: 1,
            limit: 100,
            sortBy: 'dayDate',
            order: Order.ASC,
            filter: { status: ActivationStatus.ACTIVE },
        },
    );

    const today = useMemo(() => getDatePartsInTimeZone(timeZone), [timeZone]);

    const workingHoursByDay = useMemo(() => {
        const rows = new Map(
            (workingHoursQuery.data?.data ?? []).map((workingHour) => [
                workingHour.dayOfWeek,
                workingHour,
            ]),
        );

        return DAY_ORDER.map((dayOfWeek) => {
            const row = rows.get(dayOfWeek);

            return {
                dayOfWeek,
                startTime: row?.startTime ?? null,
                endTime: row?.endTime ?? null,
            };
        });
    }, [workingHoursQuery.data]);

    const upcomingSpecialDays = useMemo<SpecialDay[]>(() => {
        return (specialDaysQuery.data?.data ?? [])
            .filter(
                (specialDay) =>
                    specialDay.status === ActivationStatus.ACTIVE &&
                    specialDay.dayDate >= today.date,
            )
            .sort((a, b) => a.dayDate.localeCompare(b.dayDate))
            .slice(0, 5);
    }, [specialDaysQuery.data, today.date]);

    const isWorkingHoursLoading = showWorkingHours && workingHoursQuery.isLoading;
    const isSpecialDaysLoading = showSpecialDays && specialDaysQuery.isLoading;

    return (
        <section
            className={`rounded-xl border border-border bg-card p-5 shadow-sm ${className ?? ''}`}
        >
            <div className="flex min-w-0 items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                        <CalendarClock className="size-4 text-muted-foreground" strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-sm font-semibold text-foreground">
                            {showWorkingHours && showSpecialDays
                                ? 'Hours & Special Days'
                                : showWorkingHours
                                  ? 'Working Hours'
                                  : 'Special Days'}
                        </h2>

                        <p className="text-[10px] text-muted-foreground">
                            Organization timezone · {timeZone}
                        </p>
                    </div>
                </div>
            </div>

            {showWorkingHours && (
                <div className="mt-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                        <Clock3 className="size-3" strokeWidth={1.8} />
                        Weekly Hours
                    </div>

                    {isWorkingHoursLoading ? (
                        <p className="mt-2 text-[11px] text-muted-foreground">
                            Loading working hours...
                        </p>
                    ) : workingHoursQuery.isError ? (
                        <p className="mt-2 text-[11px] text-destructive">
                            Working hours are unavailable right now.
                        </p>
                    ) : (
                        <ul className="mt-2 divide-y divide-border">
                            {workingHoursByDay.map((workingHour) => {
                                const isToday = workingHour.dayOfWeek === today.dayOfWeek;
                                const isOpen = Boolean(
                                    workingHour.startTime && workingHour.endTime,
                                );

                                return (
                                    <li
                                        key={workingHour.dayOfWeek}
                                        className={`flex items-center justify-between gap-3 py-1.5 text-[11px] ${
                                            isToday
                                                ? 'font-semibold text-foreground'
                                                : 'text-secondary-foreground'
                                        }`}
                                    >
                                        <span className="flex min-w-0 items-center gap-1.5">
                                            <span className="w-8 shrink-0">
                                                {DAY_LABELS[workingHour.dayOfWeek] ??
                                                    workingHour.dayOfWeek}
                                            </span>

                                            {isToday && (
                                                <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-muted-foreground uppercase">
                                                    Today
                                                </span>
                                            )}
                                        </span>

                                        {isOpen ? (
                                            <span className="shrink-0 tabular-nums">
                                                {formatClockTime(workingHour.startTime as string)} –{' '}
                                                {formatClockTime(workingHour.endTime as string)}
                                            </span>
                                        ) : (
                                            <span className="shrink-0 text-muted-foreground">
                                                Closed
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}

            {showSpecialDays && (
                <div className={showWorkingHours ? 'mt-4 border-t border-border pt-4' : 'mt-4'}>
                    <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                        <Sparkles className="size-3" strokeWidth={1.8} />
                        Upcoming Special Days
                    </div>

                    {isSpecialDaysLoading ? (
                        <p className="mt-2 text-[11px] text-muted-foreground">
                            Loading special days...
                        </p>
                    ) : specialDaysQuery.isError ? (
                        <p className="mt-2 text-[11px] text-destructive">
                            Special days are unavailable right now.
                        </p>
                    ) : upcomingSpecialDays.length === 0 ? (
                        <p className="mt-2 text-[11px] text-muted-foreground">
                            No upcoming special days. The organization follows its regular weekly
                            hours.
                        </p>
                    ) : (
                        <ul className="mt-2 flex flex-col gap-2">
                            {upcomingSpecialDays.map((specialDay) => {
                                const { weekday, label } = formatCalendarDate(specialDay.dayDate);
                                const isToday = specialDay.dayDate === today.date;

                                return (
                                    <li
                                        key={specialDay.uuid}
                                        className="flex min-w-0 items-start gap-2 rounded-lg border border-border bg-card p-2"
                                    >
                                        <div className="flex w-11 shrink-0 flex-col items-center rounded-md bg-secondary px-1 py-1 text-center">
                                            <span className="text-[9px] font-semibold tracking-wide text-muted-foreground uppercase">
                                                {weekday}
                                            </span>

                                            <span className="text-[10px] font-semibold text-foreground">
                                                {label.replace(/, \d{4}$/, '')}
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex min-w-0 items-center gap-1.5">
                                                <span
                                                    className="min-w-0 truncate text-[11px] font-semibold text-foreground"
                                                    title={specialDay.name}
                                                >
                                                    {specialDay.name}
                                                </span>

                                                {isToday && (
                                                    <span className="shrink-0 rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-muted-foreground uppercase">
                                                        Today
                                                    </span>
                                                )}
                                            </div>

                                            {specialDay.description?.trim() ? (
                                                <p
                                                    className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-muted-foreground"
                                                    title={specialDay.description}
                                                >
                                                    {specialDay.description}
                                                </p>
                                            ) : (
                                                <p className="mt-0.5 text-[10px] text-muted-foreground">
                                                    Special hours may apply on this day.
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </section>
    );
}
