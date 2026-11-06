import { Link } from 'react-router';
import {
    ArrowRight,
    BriefcaseBusiness,
    CalendarCheck,
    CalendarClock,
    CheckCircle2,
    Clock3,
} from 'lucide-react';

import { ManagementPage } from '../../../components/ManagementPage.tsx';
import { DashboardStatCard } from '../../../components/DashboardStatCard.tsx';
import { LoadingState } from '../../../../../components/LoadingState.tsx';
import { Skeleton } from '../../../../../components/Skeleton.tsx';

import { useCurrentUser } from '../../../hooks/users-hook.ts';
import { useAppointments } from '../../../hooks/appointment-hook.ts';
import { useServices } from '../../../hooks/services-hook.ts';

import { AppointmentStatus } from '../../../../../models/enums/appointment-status.ts';
import { Order } from '../../../../../models/enums/order.ts';
import { appointmentStatusRecord } from '../../../../../models/enums-mapping/appointment-status.ts';

import { formatDateForApi } from '../../utils/date.ts';
import { formatDateTimeInTimeZone } from '../../utils/timezone.ts';

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

export function CustomerDashboardPage() {
    const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();

    const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const today = formatDateForApi(new Date());

    const { data: upcoming, isLoading: upcomingLoading } = useAppointments({
        page: 1,
        limit: 5,
        sortBy: 'scheduledStartAtUTC',
        order: Order.ASC,
        filter: { fromDate: today },
    });

    const { data: confirmed } = useAppointments({
        page: 1,
        limit: 1,
        filter: { appointmentStatus: AppointmentStatus.CONFIRMED },
    });

    const { data: pending } = useAppointments({
        page: 1,
        limit: 1,
        filter: { appointmentStatus: AppointmentStatus.PENDING_ORGANIZATION_APPROVAL },
    });

    const { data: completed } = useAppointments({
        page: 1,
        limit: 1,
        filter: { appointmentStatus: AppointmentStatus.COMPLETED },
    });

    const { data: services } = useServices({ page: 1, limit: 1 });

    if (currentUserLoading) {
        return <LoadingState label="Loading dashboard..." rows={3} />;
    }

    const firstName = currentUser?.firstName ?? 'there';

    return (
        <ManagementPage title="Dashboard" description={['Your bookings and services at a glance.']}>
            <div className="flex min-w-0 flex-col gap-4">
                <section className="flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <p className="text-[11px] font-medium text-muted-foreground">Welcome back</p>

                        <h2 className="mt-0.5 truncate text-lg font-semibold tracking-tight text-foreground">
                            {firstName}
                        </h2>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                            Find a service and book your next appointment.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <Link
                            to="/customer/services"
                            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            <BriefcaseBusiness className="size-3.5" />
                            Browse Services
                        </Link>

                        <Link
                            to="/customer/appointments"
                            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-transparent px-3 text-[11px] font-semibold text-secondary-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                            <CalendarCheck className="size-3.5" />
                            My Appointments
                        </Link>
                    </div>
                </section>

                <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <DashboardStatCard
                        label="Upcoming"
                        value={upcoming?.pagination.totalItems ?? 0}
                        hint="Appointments from today onward"
                        icon={CalendarClock}
                        to="/customer/appointments"
                    />

                    <DashboardStatCard
                        label="Confirmed"
                        value={confirmed?.pagination.totalItems ?? 0}
                        hint="Approved appointments"
                        icon={CheckCircle2}
                        accent="success"
                        to="/customer/appointments"
                    />

                    <DashboardStatCard
                        label="Awaiting Approval"
                        value={pending?.pagination.totalItems ?? 0}
                        hint="Waiting for the organization"
                        icon={Clock3}
                        accent="warning"
                        to="/customer/appointments"
                    />

                    <DashboardStatCard
                        label="Services Available"
                        value={services?.pagination.totalItems ?? 0}
                        hint="Services you can book"
                        icon={BriefcaseBusiness}
                        to="/customer/services"
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
                                    Your next scheduled appointments.
                                </p>
                            </div>

                            <Link
                                to="/customer/appointments"
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
                            ) : (upcoming?.data.length ?? 0) === 0 ? (
                                <div className="rounded-lg border border-dashed border-border bg-card p-5 text-center">
                                    <p className="text-[11px] font-medium text-foreground">
                                        No upcoming appointments
                                    </p>

                                    <p className="mt-1 text-[10px] text-muted-foreground">
                                        Browse services to book your first appointment.
                                    </p>

                                    <Link
                                        to="/customer/services"
                                        className="mt-3 inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90"
                                    >
                                        Browse Services
                                    </Link>
                                </div>
                            ) : (
                                upcoming?.data.map((appointment) => (
                                    <Link
                                        key={appointment.uuid}
                                        to={`/customer/appointments/${appointment.uuid}`}
                                        className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-secondary"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-[11px] font-semibold text-foreground">
                                                {appointment.serviceName}
                                            </p>

                                            <p className="mt-0.5 truncate text-[9px] text-muted-foreground">
                                                {formatDateTimeInTimeZone(
                                                    appointment.scheduledStartAtUTC,
                                                    browserTimeZone,
                                                )}{' '}
                                                · {appointment.organizationName}
                                            </p>

                                            <p className="mt-0.5 truncate text-[9px] text-muted-foreground">
                                                Worker: {appointment.workerName || '—'}
                                            </p>
                                        </div>

                                        <StatusPill status={appointment.appointmentStatus} />
                                    </Link>
                                ))
                            )}
                        </div>
                    </section>

                    <section className="min-w-0 self-start rounded-xl border border-border bg-card p-5 shadow-sm">
                        <h2 className="text-[13px] font-semibold text-foreground">Quick Actions</h2>

                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                            Jump to the tools you use most.
                        </p>

                        <div className="mt-4 flex flex-col gap-2">
                            <QuickLink
                                to="/customer/services"
                                icon={BriefcaseBusiness}
                                label="Browse Services"
                            />

                            <QuickLink
                                to="/customer/appointments"
                                icon={CalendarCheck}
                                label="My Appointments"
                            />

                            <QuickLink
                                to="/customer/profile"
                                icon={CheckCircle2}
                                label="My Profile"
                            />
                        </div>

                        <div className="mt-4 rounded-lg border border-border bg-card p-3">
                            <p className="text-[10px] leading-4 text-muted-foreground">
                                Completed appointments: {completed?.pagination.totalItems ?? 0}
                            </p>
                        </div>
                    </section>
                </div>
            </div>
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
