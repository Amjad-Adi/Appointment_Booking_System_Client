import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { ManagementPage } from '../components/ManagementPage.tsx';

import { useCurrentUser } from '../hooks/users-hook.ts';
import { useOrganization } from '../hooks/organization-hook.ts';
import { useOrganizationAppointments } from '../hooks/appointment-hook.ts';
import { useOrganizationWorkingHours } from '../hooks/working-hours-hook.ts';
import { useOrganizationTimeBlocks } from '../hooks/time-block-hook.ts';
import { useOrganizationSpecialDays } from '../hooks/special-days-hook.ts';

import { Role } from '../../../models/enums/roles.ts';
import { ActivationStatus } from '../../../models/enums/activation-status.ts';
import type { AppointmentResponse } from '../../../models/appointment.model.ts';

import { AppointmentCalendar } from './components/AppointmentCalendar.tsx';
import { AppointmentDaySchedule } from './components/AppointmentDaySchedule.tsx';
import { CreateAppointmentDialog } from './components/CreateAppointmentDialog.tsx';
import { EditAppointmentDialog } from './components/EditAppointmentDialog.tsx';

import { buildWorkerSchedules } from '../user-view/utils/build-worker-schedules.ts';
import { formatDateForApi } from '../user-view/utils/date.ts';

export function AppointmentPage() {
    const navigate = useNavigate();

    const {
        data: currentUser,
        isLoading: currentUserLoading,
        isError: currentUserError,
    } = useCurrentUser();

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [createAppointmentOpen, setCreateAppointmentOpen] = useState(false);

    const [appointmentWorkerUuid, setAppointmentWorkerUuid] = useState<string | undefined>();

    const [appointmentDate, setAppointmentDate] = useState<Date | undefined>();

    const [appointmentTime, setAppointmentTime] = useState<Date | undefined>();

    const [editAppointmentOpen, setEditAppointmentOpen] = useState(false);

    const [selectedAppointment, setSelectedAppointment] = useState<
        AppointmentResponse | undefined
    >();

    const organizationUuid = currentUser?.organizationUuid;

    const {
        data: organization,
        isLoading: organizationLoading,
        isError: organizationError,
    } = useOrganization(organizationUuid ?? '');

    const organizationTimeZone = organization?.location.timezone ?? 'UTC';

    /*
     * Always calculate the API date in the organization's timezone.
     */
    const date = formatDateForApi(selectedDate, organizationTimeZone);

    const canManageAppointments =
        Boolean(organizationUuid) &&
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

    const activeSpecialDay = useMemo(
        () =>
            specialDays?.data.find(
                (specialDay) =>
                    specialDay.dayDate === date && specialDay.status === ActivationStatus.ACTIVE,
            ),
        [specialDays, date],
    );

    const workerSchedules = useMemo(() => {
        /*
         * A special day completely replaces the normal worker
         * schedule for that date.
         */
        if (activeSpecialDay) {
            return [];
        }

        return buildWorkerSchedules({
            workingHours: workingHours?.data ?? [],
            appointments: appointmentData?.data ?? [],
            timeBlocks: timeBlockData?.data ?? [],
            date: selectedDate,
            timeZone: organizationTimeZone,
        });
    }, [
        activeSpecialDay,
        workingHours,
        appointmentData,
        timeBlockData,
        selectedDate,
        organizationTimeZone,
    ]);

    const handleAppointmentView = (appointment: AppointmentResponse) => {
        navigate(`/organization/appointments/${appointment.uuid}`);
    };

    const handleAppointmentEdit = (appointment: AppointmentResponse) => {
        setSelectedAppointment(appointment);
        setEditAppointmentOpen(true);
    };

    const handleAddAppointment = (date: Date, startAt: Date, workerUuid?: string) => {
        setAppointmentDate(date);
        setAppointmentTime(startAt);
        setAppointmentWorkerUuid(workerUuid);
        setCreateAppointmentOpen(true);
    };

    const handleCreateOpenChange = (open: boolean) => {
        setCreateAppointmentOpen(open);

        if (!open) {
            setAppointmentDate(undefined);
            setAppointmentTime(undefined);
            setAppointmentWorkerUuid(undefined);
        }
    };

    const handleEditOpenChange = (open: boolean) => {
        setEditAppointmentOpen(open);

        if (!open) {
            setSelectedAppointment(undefined);
        }
    };

    const isLoading =
        currentUserLoading ||
        organizationLoading ||
        appointmentsLoading ||
        workingHoursLoading ||
        timeBlocksLoading ||
        specialDaysLoading;

    const isError =
        currentUserError ||
        organizationError ||
        appointmentsError ||
        workingHoursError ||
        timeBlocksError ||
        specialDaysError;

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
                        onDateChange={setSelectedDate}
                        organizationTimeZone={organizationTimeZone}
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
                            organizationTimeZone={organizationTimeZone}
                            canCreate={canManageAppointments}
                            onAddAppointment={handleAddAppointment}
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
            </div>
        </ManagementPage>
    );
}
