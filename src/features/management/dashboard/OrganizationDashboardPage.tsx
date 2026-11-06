import { useState } from 'react';
import { Link } from 'react-router';
import {
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    CalendarCheck,
    CalendarClock,
    ClipboardCheck,
    Clock3,
    DoorOpen,
    Users,
    X,
} from 'lucide-react';

import { ManagementPage } from '../components/ManagementPage.tsx';
import { DashboardStatCard } from '../components/DashboardStatCard.tsx';
import { LoadingState } from '../../../components/LoadingState.tsx';
import { Skeleton } from '../../../components/Skeleton.tsx';

import { useCurrentUser, useUsers } from '../hooks/users-hook.ts';
import { useOrganization } from '../hooks/organization-hook.ts';
import { useOrganizationAppointments } from '../hooks/appointment-hook.ts';
import { useOrganizationServices } from '../hooks/services-hook.ts';
import { useOrganizationRooms } from '../hooks/room-hook.ts';
import { useOrganizationWorkingHours } from '../hooks/working-hours-hook.ts';

import { DayOfWeek } from '../../../models/enums/day-of-week.ts';
import { dayOfWeekRecord } from '../../../models/enums-mapping/day-of-week.ts';
import { Role } from '../../../models/enums/roles.ts';
import { ActivationStatus } from '../../../models/enums/activation-status.ts';
import { AppointmentStatus } from '../../../models/enums/appointment-status.ts';
import { Order } from '../../../models/enums/order.ts';
import { roleRecord } from '../../../models/enums-mapping/roles.ts';
import { appointmentStatusRecord } from '../../../models/enums-mapping/appointment-status.ts';

import { formatDateForApi } from '../user-view/utils/date.ts';
import { formatDateTimeInTimeZone } from '../user-view/utils/timezone.ts';

const WEEK_ORDER: DayOfWeek[] = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY,
];

const statusClasses: Record<string, string> = {
    [AppointmentStatus.PENDING_USER_CONFIRMATION]: 'border-warning-border bg-warning-soft text-warning',
    [AppointmentStatus.PENDING_ORGANIZATION_APPROVAL]:
        'border-info-border bg-info-soft text-info',
    [AppointmentStatus.CONFIRMED]: 'border-success-border bg-success-soft text-success',
    [AppointmentStatus.IN_PROGRESS]: 'border-status-accent-border bg-status-accent-soft text-status-accent',
    [AppointmentStatus.COMPLETED]: 'border-border bg-muted text-muted-foreground',
    [AppointmentStatus.REJECTED]: 'border-destructive-border bg-destructive-soft text-destructive',
    [AppointmentStatus.CANCELLED]: 'border-destructive-border bg-destructive-soft text-destructive',
    [AppointmentStatus.NO_SHOW]: 'border-border bg-muted text-muted-foreground',
};

function StatusPill({ status }: { status: AppointmentStatus }) {
    return (
        <span
            className={[
                'inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[9px] font-semibold',
                statusClasses[status] ?? 'border-border bg-secondary text-secondary-foreground',
            ].join(' ')}
        >
            {appointmentStatusRecord[status]}
        </span>
    );
}

export function OrganizationDashboardPage() {
    const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();

    const organizationUuid = currentUser?.organizationUuid;

    const { data: organization } = useOrganization(organizationUuid ?? '');

    const organizationTimeZone = organization?.location.timezone ?? 'UTC';

    const today = formatDateForApi(new Date(), organizationTimeZone);

    const isWorker = currentUser?.role === Role.WORKER;

    const canConfigureWorkingHours =
        currentUser?.role === Role.OWNER ||
        currentUser?.role === Role.MANAGER ||
        currentUser?.role === Role.CRM;

    const { data: workingHours } = useOrganizationWorkingHours(
        canConfigureWorkingHours ? organizationUuid : undefined,
        { page: 1, limit: 7, sortBy: 'dayOfWeek' },
    );

    const [isWorkingHoursReminderDismissed, setIsWorkingHoursReminderDismissed] = useState(false);

    const workingHoursByDay = new Map(
        (workingHours?.data ?? []).map((workingHour) => [workingHour.dayOfWeek, workingHour]),
    );

    const hasOpenDay = (workingHours?.data ?? []).some((workingHour) =>
        Boolean(workingHour.startTime && workingHour.endTime),
    );

    const showWorkingHoursReminder =
        Boolean(organizationUuid) &&
        canConfigureWorkingHours &&
        workingHours !== undefined &&
        !hasOpenDay &&
        !isWorkingHoursReminderDismissed;

    const canReadUsers =
        currentUser?.role === Role.OWNER ||
        currentUser?.role === Role.MANAGER ||
        currentUser?.role === Role.CRM;

    const canManageOrganization = canReadUsers;
    const canCreateOrganization = currentUser?.role === Role.OWNER;

    const workerScope =
        isWorker && currentUser?.uuid ? { workerUuid: currentUser.uuid } : {};

    const { data: todayAppointments } = useOrganizationAppointments(organizationUuid, {
        page: 1,
        limit: 1,
        filter: {
            appointmentDate: today,
            ...workerScope,
        },
    });

    const { data: pendingAppointments } = useOrganizationAppointments(organizationUuid, {
        page: 1,
        limit: 1,
        filter: {
            appointmentStatus: AppointmentStatus.PENDING_ORGANIZATION_APPROVAL,
            ...workerScope,
        },
    });

    const {
        data: upcomingAppointments,
        isLoading: upcomingLoading,
        isError: upcomingError,
    } = useOrganizationAppointments(organizationUuid, {
        page: 1,
        limit: 5,
        sortBy: 'scheduledStartAtUTC',
        order: Order.ASC,
        filter: {
            fromDate: today,
            ...workerScope,
        },
    });

    const { data: services } = useOrganizationServices(organizationUuid, {
        page: 1,
        limit: 1,
    });

    const { data: rooms } = useOrganizationRooms(organizationUuid, {
        page: 1,
        limit: 1,
    });

    const { data: workers } = useUsers(
        {
            page: 1,
            limit: 1,
            filter: {
                organizationUuid,
                role: Role.WORKER,
                status: ActivationStatus.ACTIVE,
            },
        },
        canReadUsers && Boolean(organizationUuid),
    );

    if (currentUserLoading) {
        return <LoadingState label="Loading dashboard..." rows={3} />;
    }

    const firstName = currentUser?.firstName ?? 'there';

    return (
        <ManagementPage title="Dashboard" description={['Your organization at a glance.']}>
            {!organizationUuid ? (
                <section className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary">
                        <Building2 className="size-6 text-secondary-foreground" strokeWidth={1.8} />
                    </div>

                    <h2 className="mt-4 text-sm font-semibold text-foreground">
                        Create your organization first
                    </h2>

                    <p className="mx-auto mt-1 max-w-md text-[11px] leading-5 text-muted-foreground">
                        Set up your organization to start managing services, rooms, staff and
                        appointments.
                    </p>

                    {canCreateOrganization && (
                        <Link
                            to="/organization/create"
                            className="mt-5 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            <Building2 className="size-3.5" />
                            Create Organization
                        </Link>
                    )}
                </section>
            ) : (
                <div className="flex min-w-0 flex-col gap-4">
                    <section className="flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium text-muted-foreground">
                                {roleRecord[currentUser?.role ?? Role.CUSTOMER]}
                            </p>

                            <h2 className="mt-0.5 truncate text-lg font-semibold tracking-tight text-foreground">
                                Welcome back, {firstName}
                            </h2>

                            <p className="mt-1 truncate text-[11px] text-muted-foreground">
                                {organization?.name ?? 'Your organization'} ·{' '}
                                {organizationTimeZone}
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <Link
                                to="/organization/appointments"
                                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                <CalendarCheck className="size-3.5" />
                                Open Schedule
                            </Link>

                            {canManageOrganization && (
                                <Link
                                    to={`/organization/organization-profile/${organizationUuid}`}
                                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-transparent px-3 text-[11px] font-semibold text-secondary-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                >
                                    <Building2 className="size-3.5" />
                                    Organization
                                </Link>
                            )}
                        </div>
                    </section>

                    {showWorkingHoursReminder && (
                        <section className="relative overflow-hidden rounded-xl border border-status-accent-border bg-gradient-to-br from-status-accent-soft via-card to-card p-5 shadow-sm">
                            <div
                                className="pointer-events-none absolute -top-12 -right-10 size-36 rounded-full bg-status-accent/10 blur-2xl"
                                aria-hidden="true"
                            />

                            <button
                                type="button"
                                onClick={() => setIsWorkingHoursReminderDismissed(true)}
                                aria-label="Dismiss working hours reminder"
                                className="absolute top-2 right-2 z-10 flex size-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                            >
                                <X className="size-3.5" strokeWidth={2} />
                            </button>

                            <div className="relative flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex min-w-0 items-start gap-3 pr-6">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-status-accent-border bg-card text-status-accent shadow-sm">
                                        <CalendarClock className="size-5" strokeWidth={1.8} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[9px] font-semibold tracking-[0.08em] text-status-accent uppercase">
                                            Setup · 1 step remaining
                                        </p>

                                        <h2 className="mt-0.5 text-[15px] font-semibold tracking-tight text-foreground">
                                            When is your business open?
                                        </h2>

                                        <p className="mt-1 max-w-xl text-[11px] leading-5 text-muted-foreground">
                                            Your organization is ready, but appointments cannot be
                                            scheduled until weekly working hours are set. Add them
                                            once and your team can start taking bookings.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-1 rounded-lg border border-border bg-card/80 p-1.5">
                                        {WEEK_ORDER.map((day) => {
                                            const workingHour = workingHoursByDay.get(day);
                                            const isOpen = Boolean(
                                                workingHour?.startTime && workingHour?.endTime,
                                            );

                                            return (
                                                <span
                                                    key={day}
                                                    title={`${dayOfWeekRecord[day]}: ${
                                                        isOpen ? 'Open' : 'Not set'
                                                    }`}
                                                    className={[
                                                        'flex h-6 w-8 items-center justify-center rounded-md text-[9px] font-semibold',
                                                        isOpen
                                                            ? 'bg-success-soft text-success'
                                                            : 'bg-secondary text-muted-foreground',
                                                    ].join(' ')}
                                                >
                                                    {dayOfWeekRecord[day].slice(0, 3)}
                                                </span>
                                            );
                                        })}
                                    </div>

                                    <Link
                                        to={`/organization/organization-profile/${organizationUuid}#working-hours`}
                                        className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-[11px] font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                                    >
                                        <Clock3 className="size-3.5" />
                                        Set working hours
                                        <ArrowRight className="size-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </section>
                    )}

                    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <DashboardStatCard
                            label="Appointments Today"
                            value={todayAppointments?.pagination.totalItems ?? 0}
                            hint={today}
                            icon={CalendarClock}
                            to="/organization/appointments"
                        />

                        <DashboardStatCard
                            label="Pending Review"
                            value={pendingAppointments?.pagination.totalItems ?? 0}
                            hint="Waiting for organization approval"
                            icon={ClipboardCheck}
                            accent="warning"
                            to="/organization/appointments"
                        />

                        <DashboardStatCard
                            label="Active Services"
                            value={services?.pagination.totalItems ?? 0}
                            hint="Services currently offered"
                            icon={BriefcaseBusiness}
                            to="/organization/services"
                        />

                        <DashboardStatCard
                            label={canReadUsers ? 'Active Workers' : 'Available Rooms'}
                            value={
                                canReadUsers
                                    ? (workers?.pagination.totalItems ?? 0)
                                    : (rooms?.pagination.totalItems ?? 0)
                            }
                            hint={canReadUsers ? 'Staff available for booking' : 'Rooms in this organization'}
                            icon={canReadUsers ? Users : DoorOpen}
                            to={canReadUsers ? '/organization/invitations' : '/organization/rooms'}
                        />
                    </div>

                    <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
                        <section className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-[13px] font-semibold text-foreground">
                                        Upcoming Appointments
                                    </h2>

                                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                                        The next scheduled appointments.
                                    </p>
                                </div>

                                <Link
                                    to="/organization/appointments"
                                    className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-secondary-foreground hover:text-foreground"
                                >
                                    View all
                                    <ArrowRight className="size-3" />
                                </Link>
                            </div>

                            <div className="mt-4 flex flex-col gap-2">
                                {upcomingLoading ? (
                                    <div className="flex flex-col gap-2" role="status">
                                        <span className="sr-only">Loading appointments...</span>

                                        <Skeleton className="h-12 w-full rounded-lg" />
                                        <Skeleton className="h-12 w-full rounded-lg" />
                                        <Skeleton className="h-12 w-full rounded-lg" />
                                    </div>
                                ) : upcomingError ? (
                                    <p className="text-[11px] text-destructive">
                                        Failed to load appointments.
                                    </p>
                                ) : (upcomingAppointments?.data.length ?? 0) === 0 ? (
                                    <div className="rounded-lg border border-dashed border-border bg-card p-5 text-center">
                                        <p className="text-[11px] font-medium text-foreground">
                                            No upcoming appointments
                                        </p>

                                        <p className="mt-1 text-[10px] text-muted-foreground">
                                            New bookings will appear here.
                                        </p>
                                    </div>
                                ) : (
                                    upcomingAppointments?.data.map((appointment) => (
                                        <Link
                                            key={appointment.uuid}
                                            to={`/organization/appointments/${appointment.uuid}`}
                                            className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-secondary"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-[11px] font-semibold text-foreground">
                                                    {appointment.serviceName}
                                                </p>

                                                <p className="mt-0.5 truncate text-[9px] text-muted-foreground">
                                                    {formatDateTimeInTimeZone(
                                                        appointment.scheduledStartAtUTC,
                                                        organizationTimeZone,
                                                    )}{' '}
                                                    · {appointment.userName}
                                                </p>

                                                <p className="mt-0.5 truncate text-[9px] text-muted-foreground">
                                                    Worker: {appointment.workerName || '—'} · Room:{' '}
                                                    {appointment.roomName || '—'}
                                                </p>
                                            </div>

                                            <StatusPill status={appointment.appointmentStatus} />
                                        </Link>
                                    ))
                                )}
                            </div>
                        </section>

                        <section className="min-w-0 self-start rounded-xl border border-border bg-card p-5 shadow-sm">
                            <h2 className="text-[13px] font-semibold text-foreground">
                                Quick Actions
                            </h2>

                            <p className="mt-0.5 text-[10px] text-muted-foreground">
                                Jump to the tools you use most.
                            </p>

                            <div className="mt-4 flex flex-col gap-2">
                                <QuickLink
                                    to="/organization/services"
                                    icon={BriefcaseBusiness}
                                    label="Manage Services"
                                />

                                <QuickLink
                                    to="/organization/rooms"
                                    icon={DoorOpen}
                                    label="Manage Rooms"
                                />

                                <QuickLink
                                    to="/organization/appointments"
                                    icon={CalendarCheck}
                                    label="Appointment Schedule"
                                />

                                {canReadUsers ? (
                                    <QuickLink
                                        to="/organization/invitations"
                                        icon={Users}
                                        label="Invitations"
                                    />
                                ) : null}
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </ManagementPage>
    );
}

function QuickLink({
    to,
    icon: Icon,
    label,
}: {
    to: string;
    icon: typeof BriefcaseBusiness;
    label: string;
}) {
    return (
        <Link
            to={to}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-[11px] font-medium text-secondary-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
            <span className="flex min-w-0 items-center gap-2">
                <Icon className="size-3.5 shrink-0" strokeWidth={1.8} />
                <span className="truncate">{label}</span>
            </span>

            <ArrowRight className="size-3 shrink-0" />
        </Link>
    );
}
