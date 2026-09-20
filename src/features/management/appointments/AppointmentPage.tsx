import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { ManagementPage } from '../components/ManagementPage.tsx';

import { useCurrentUser, useUsers } from '../hooks/users-hook.ts';
import { useOrganization } from '../hooks/organization-hook.ts';
import { useOrganizationAppointments } from '../hooks/appointment-hook.ts';
import { useOrganizationWorkingHours } from '../hooks/working-hours-hook.ts';
import { useOrganizationTimeBlocks } from '../hooks/time-block-hook.ts';
import { useOrganizationSpecialDays } from '../hooks/special-days-hook.ts';

import { Role } from '../../../models/enums/roles.ts';
import { ActivationStatus } from '../../../models/enums/activation-status.ts';
import type { OrganizationAppointmentResponse } from '../../../models/appointment.model.ts';

import { AppointmentCalendar } from './components/AppointmentCalendar.tsx';
import { AppointmentDaySchedule } from './components/AppointmentDaySchedule.tsx';
import { CreateAppointmentDialog } from './components/CreateAppointmentDialog.tsx';
import { EditAppointmentDialog } from './components/EditAppointmentDialog.tsx';
import { CreateSpecialDayDialog } from './components/CreateSpecialDayDialog.tsx';
import { CreateTimeBlockDialog } from './components/CreateTimeBlockDialog.tsx';

import { buildWorkerSchedules } from '../user-view/utils/build-worker-schedules.ts';
import { formatDateForApi } from '../user-view/utils/date.ts';

import { formatDateInTimeZone } from '../user-view/utils/timezone.ts';

export function AppointmentPage() {
    const navigate = useNavigate();

    const {
        data: currentUser,
        isLoading: currentUserLoading,
        isError: currentUserError,
    } = useCurrentUser();

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [calendarMonth, setCalendarMonth] = useState(new Date());

    const [createAppointmentOpen, setCreateAppointmentOpen] = useState(false);

    const [appointmentWorkerUuid, setAppointmentWorkerUuid] = useState<string | undefined>();

    const [appointmentDate, setAppointmentDate] = useState<Date | undefined>();

    const [appointmentTime, setAppointmentTime] = useState<Date | undefined>();

    const [editAppointmentOpen, setEditAppointmentOpen] = useState(false);

    const [selectedAppointment, setSelectedAppointment] = useState<
        OrganizationAppointmentResponse | undefined
    >();

    const [createSpecialDayOpen, setCreateSpecialDayOpen] = useState(false);

    const [createTimeBlockOpen, setCreateTimeBlockOpen] = useState(false);

    const [timeBlockStartAt, setTimeBlockStartAt] = useState<Date | undefined>();

    const [timeBlockEndAt, setTimeBlockEndAt] = useState<Date | undefined>();

    const organizationUuid = currentUser?.organizationUuid;

    const {
        data: organization,
        isLoading: organizationLoading,
        isError: organizationError,
    } = useOrganization(organizationUuid ?? '');

    const organizationTimeZone = organization?.location.timezone ?? 'UTC';

    const date = formatDateForApi(selectedDate, organizationTimeZone);

    const todayDate = formatDateForApi(new Date(), organizationTimeZone);

    const canManageAppointments =
        Boolean(organizationUuid) &&
        (currentUser?.role === Role.MANAGER || currentUser?.role === Role.OWNER);

    const canCreateTimeBlock = Boolean(organizationUuid) && currentUser?.role === Role.WORKER;

    const canCreateSpecialDay = canManageAppointments && date >= todayDate;

    const calendarRange = useMemo(() => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        return {
            fromDate: formatDateForApi(firstDayOfMonth, organizationTimeZone),

            toDate: formatDateForApi(lastDayOfMonth, organizationTimeZone),
        };
    }, [calendarMonth, organizationTimeZone]);

    const {
        data: appointmentData,
        isLoading: appointmentsLoading,
        isError: appointmentsError,
    } = useOrganizationAppointments(organizationUuid, {
        page: 1,
        limit: 100,
        filter: {
            appointmentDate: date,
        },
    });

    const {
        data: calendarAppointmentData,
        isLoading: calendarAppointmentsLoading,
        isError: calendarAppointmentsError,
    } = useOrganizationAppointments(organizationUuid, {
        page: 1,
        limit: 1000,
        filter: {
            fromDate: calendarRange.fromDate,
            toDate: calendarRange.toDate,
        },
    });

    const appointmentDates = useMemo(() => {
        const dates = new Map<string, Date>();

        for (const appointment of calendarAppointmentData?.data ?? []) {
            const appointmentStart = new Date(appointment.scheduledStartAtUTC);

            const dateKey = new Intl.DateTimeFormat('en-CA', {
                timeZone: organizationTimeZone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).format(appointmentStart);

            if (!dates.has(dateKey)) {
                dates.set(dateKey, appointmentStart);
            }
        }

        return Array.from(dates.values());
    }, [calendarAppointmentData, organizationTimeZone]);

    const {
        data: workingHours,
        isLoading: workingHoursLoading,
        isError: workingHoursError,
    } = useOrganizationWorkingHours(organizationUuid, {
        page: 1,
        limit: 100,
    });

    const {
        data: timeBlockData,
        isLoading: timeBlocksLoading,
        isError: timeBlocksError,
    } = useOrganizationTimeBlocks(organizationUuid, {
        page: 1,
        limit: 100,
        sortBy: 'startAtUTC',
        filter: {
            fromDate: date,
            toDate: date,
        },
    });

    const {
        data: specialDays,
        isLoading: specialDaysLoading,
        isError: specialDaysError,
    } = useOrganizationSpecialDays(organizationUuid);

    const {
        data: usersData,
        isLoading: usersLoading,
        isError: usersError,
    } = useUsers({
        page: 1,
        limit: 100,
        filter: {
            organizationUuid,
            role: Role.WORKER,
            status: ActivationStatus.ACTIVE,
        },
    });

    const activeSpecialDay = useMemo(
        () =>
            specialDays?.data.find(
                (specialDay) =>
                    specialDay.dayDate === date && specialDay.status === ActivationStatus.ACTIVE,
            ),
        [specialDays, date],
    );

    const workerSchedules = useMemo(() => {
        if (activeSpecialDay) {
            return [];
        }

        return buildWorkerSchedules({
            workers: usersData?.data ?? [],
            workingHours: workingHours?.data ?? [],
            appointments: appointmentData?.data ?? [],
            timeBlocks: timeBlockData?.data ?? [],
            date: selectedDate,
            timeZone: organizationTimeZone,
        });
    }, [
        activeSpecialDay,
        usersData,
        workingHours,
        appointmentData,
        timeBlockData,
        selectedDate,
        organizationTimeZone,
    ]);

    const handleAppointmentView = (appointment: OrganizationAppointmentResponse) => {
        navigate(`/organization/appointments/${appointment.uuid}`);
    };

    const handleAppointmentEdit = (appointment: OrganizationAppointmentResponse) => {
        setSelectedAppointment(appointment);
        setEditAppointmentOpen(true);
    };

    const handleAddAppointment = (date: Date, startAt: Date, workerUuid?: string) => {
        setAppointmentDate(date);
        setAppointmentTime(startAt);
        setAppointmentWorkerUuid(workerUuid);
        setCreateAppointmentOpen(true);
    };

    const handleAddTimeBlock = (_date: Date, startAt: Date, endAt: Date, _workerUuid: string) => {
        setTimeBlockStartAt(startAt);
        setTimeBlockEndAt(endAt);
        setCreateTimeBlockOpen(true);
    };

    const handleCreateOpenChange = (open: boolean) => {
        setCreateAppointmentOpen(open);

        if (!open) {
            setAppointmentDate(undefined);
            setAppointmentTime(undefined);
            setAppointmentWorkerUuid(undefined);
        }
    };

    const handleTimeBlockOpenChange = (open: boolean) => {
        setCreateTimeBlockOpen(open);

        if (!open) {
            setTimeBlockStartAt(undefined);
            setTimeBlockEndAt(undefined);
        }
    };

    const handleSpecialDayOpenChange = (open: boolean) => {
        setCreateSpecialDayOpen(open);
    };

    const handleEditOpenChange = (open: boolean) => {
        setEditAppointmentOpen(open);

        if (!open) {
            setSelectedAppointment(undefined);
        }
    };

    const handleCalendarMonthChange = (month: Date) => {
        setCalendarMonth(month);
    };

    const handleCalendarDateChange = (date: Date) => {
        setSelectedDate(date);

        setCalendarMonth((currentMonth) => {
            if (
                currentMonth.getFullYear() === date.getFullYear() &&
                currentMonth.getMonth() === date.getMonth()
            ) {
                return currentMonth;
            }

            return date;
        });
    };

    const isLoading =
        currentUserLoading ||
        organizationLoading ||
        appointmentsLoading ||
        calendarAppointmentsLoading ||
        workingHoursLoading ||
        timeBlocksLoading ||
        specialDaysLoading ||
        usersLoading;

    const isError =
        currentUserError ||
        organizationError ||
        appointmentsError ||
        calendarAppointmentsError ||
        workingHoursError ||
        timeBlocksError ||
        specialDaysError ||
        usersError;

    if (isLoading) {
        return <div>Loading appointments...</div>;
    }

    if (isError) {
        return <div>Failed to load appointment schedule.</div>;
    }

    if (!organizationUuid || !organization) {
        return <div>Organization not found.</div>;
    }

    return (
        <ManagementPage
            title="Appointments"
            description={['View and manage organization appointments and their schedules.']}
        >
            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
                <section className="min-w-0 self-start rounded-xl border border-[#d3d3df] bg-[#EDEDF2] p-2 shadow-sm lg:sticky lg:top-4">
                    <AppointmentCalendar
                        selectedDate={selectedDate}
                        onDateChange={handleCalendarDateChange}
                        organizationTimeZone={organizationTimeZone}
                        appointmentDates={appointmentDates}
                        onMonthChange={handleCalendarMonthChange}
                    />
                </section>

                <div className="min-w-0">
                    {activeSpecialDay ? (
                        <section className="flex max-h-[calc(100vh-8rem)] min-h-0 min-w-0 flex-col rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-4">
                            <div className="mb-4 shrink-0 text-center">
                                <h2 className="text-base font-semibold text-[#343447]">
                                    Daily Schedule
                                </h2>

                                <p className="mt-0.5 text-[11px] text-[#777789]">
                                    {formatDateInTimeZone(selectedDate, organizationTimeZone)}
                                </p>
                            </div>

                            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                                <div className="rounded-xl border border-dashed border-[#d3d3df] bg-white p-6 text-center">
                                    <p className="text-sm font-medium text-[#343447]">
                                        {activeSpecialDay.name}
                                    </p>

                                    <p className="mt-1 text-[11px] text-[#777789]">
                                        Special day · Schedule unavailable
                                    </p>

                                    {activeSpecialDay.description ? (
                                        <p className="mx-auto mt-3 max-w-lg text-[11px] leading-5 text-[#777789]">
                                            {activeSpecialDay.description}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </section>
                    ) : (
                        <AppointmentDaySchedule
                            date={selectedDate}
                            workerSchedules={workerSchedules}
                            organizationTimeZone={organizationTimeZone}
                            canCreate={canManageAppointments}
                            onAddAppointment={handleAddAppointment}
                            canCreateTimeBlock={canCreateTimeBlock}
                            onAddTimeBlock={handleAddTimeBlock}
                            onViewAppointment={handleAppointmentView}
                            onEditAppointment={
                                canManageAppointments ? handleAppointmentEdit : undefined
                            }
                        />
                    )}
                </div>

                {canManageAppointments ? (
                    <CreateAppointmentDialog
                        organizationUuid={organizationUuid}
                        organizationTimeZone={organizationTimeZone}
                        open={createAppointmentOpen}
                        onOpenChange={handleCreateOpenChange}
                        selectedDate={appointmentDate}
                        selectedTime={appointmentTime}
                        selectedWorkerUuid={appointmentWorkerUuid}
                    />
                ) : null}

                {canManageAppointments && selectedAppointment ? (
                    <EditAppointmentDialog
                        organizationUuid={organizationUuid}
                        appointment={selectedAppointment}
                        open={editAppointmentOpen}
                        onOpenChange={handleEditOpenChange}
                    />
                ) : null}

                {canManageAppointments ? (
                    <CreateSpecialDayDialog
                        organizationUuid={organizationUuid}
                        open={createSpecialDayOpen}
                        onOpenChange={handleSpecialDayOpenChange}
                        dayDate={date}
                    />
                ) : null}

                {canCreateTimeBlock ? (
                    <CreateTimeBlockDialog
                        organizationUuid={organizationUuid}
                        organizationTimeZone={organizationTimeZone}
                        open={createTimeBlockOpen}
                        onOpenChange={handleTimeBlockOpenChange}
                        startAt={timeBlockStartAt}
                        endAt={timeBlockEndAt}
                    />
                ) : null}
            </div>
        </ManagementPage>
    );
}
