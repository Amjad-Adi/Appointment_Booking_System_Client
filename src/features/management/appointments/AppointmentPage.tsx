import { useMemo, useState } from 'react';

import { ManagementPage } from '../components/ManagementPage.tsx';
import { useCurrentUser } from '../hooks/users-hook.ts';
import { useOrganizationAppointments } from '../hooks/appointment-hook.ts';
import { useOrganizationWorkingHours } from '../hooks/working-hours-hook.ts';
import { useOrganizationTimeBlocks } from '../hooks/time-block-hook.ts';
import { useOrganizationSpecialDays } from '../hooks/special-days-hook.ts';

import { Role } from '../../../models/enums/roles.ts';
import { ActivationStatus } from '../../../models/enums/activation-status.ts';

import { AppointmentCalendar } from './components/AppointmentCalendar.tsx';
import { AppointmentDaySchedule } from './components/AppointmentDaySchedule.tsx';
import { CreateAppointmentDialog } from './components/CreateAppointmentDialog.tsx';

import { buildWorkerSchedules } from '../user-view/utils/build-worker-schedules.ts';
import { formatDateForApi } from '../user-view/utils/date.ts';

export function AppointmentPage() {
    const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [createAppointmentOpen, setCreateAppointmentOpen] = useState(false);
    const [appointmentWorkerUuid, setAppointmentWorkerUuid] = useState<string>();
    const [appointmentDate, setAppointmentDate] = useState<Date>();
    const [appointmentTime, setAppointmentTime] = useState<Date>();

    const organizationUuid = currentUser?.organizationUuid;
    const date = formatDateForApi(selectedDate);

    const canManageAppointments =
        organizationUuid != null &&
        (currentUser?.role === Role.MANAGER || currentUser?.role === Role.OWNER);

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
        sortOrder: 'asc',
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

    const activeSpecialDay = useMemo(() => {
        return specialDays?.data.find(
            (specialDay) =>
                specialDay.dayDate === date && specialDay.status === ActivationStatus.ACTIVE,
        );
    }, [specialDays, date]);

    const workerSchedules = useMemo(() => {
        if (activeSpecialDay) {
            return [];
        }

        return buildWorkerSchedules({
            workingHours: workingHours?.data ?? [],
            appointments: appointmentData?.data ?? [],
            timeBlocks: timeBlockData?.data ?? [],
            date: selectedDate,
        });
    }, [activeSpecialDay, workingHours, appointmentData, timeBlockData, selectedDate]);

    const isLoading =
        currentUserLoading ||
        appointmentsLoading ||
        workingHoursLoading ||
        timeBlocksLoading ||
        specialDaysLoading;

    const isError = appointmentsError || workingHoursError || timeBlocksError || specialDaysError;

    if (isLoading) {
        return <div>Loading appointments...</div>;
    }

    if (isError) {
        return <div>Failed to load appointment schedule.</div>;
    }

    if (!organizationUuid) {
        return <div>Organization not found.</div>;
    }

    return (
        <ManagementPage
            title="Appointments"
            description={['View and manage organization appointments and their schedules.']}
        >
            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
                <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-white p-2 shadow-sm">
                    <AppointmentCalendar
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                    />
                </section>

                <div className="min-w-0">
                    {activeSpecialDay ? (
                        <section className="rounded-xl border border-[#d3d3df] bg-white p-6">
                            <h2 className="text-sm font-semibold text-[#343447]">
                                {activeSpecialDay.name}
                            </h2>

                            {activeSpecialDay.description ? (
                                <p className="mt-1 text-[11px] text-[#777789]">
                                    {activeSpecialDay.description}
                                </p>
                            ) : null}

                            <p className="mt-3 text-[11px] text-[#777789]">
                                The organization is unavailable on this day.
                            </p>
                        </section>
                    ) : (
                        <AppointmentDaySchedule
                            date={selectedDate}
                            workerSchedules={workerSchedules}
                            canCreate={canManageAppointments}
                            onAddAppointment={(date, startAt, workerUuid) => {
                                setAppointmentDate(date);
                                setAppointmentTime(startAt);
                                setAppointmentWorkerUuid(workerUuid);
                                setCreateAppointmentOpen(true);
                            }}
                        />
                    )}
                </div>

                {canManageAppointments ? (
                    <CreateAppointmentDialog
                        organizationUuid={organizationUuid}
                        open={createAppointmentOpen}
                        onOpenChange={setCreateAppointmentOpen}
                        selectedDate={appointmentDate}
                        selectedTime={appointmentTime}
                        selectedWorkerUuid={appointmentWorkerUuid}
                    />
                ) : null}
            </div>
        </ManagementPage>
    );
}
