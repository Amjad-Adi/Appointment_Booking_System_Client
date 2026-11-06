import type { ReactNode } from 'react';
import { Link } from 'react-router';
import type { OnChangeFn, PaginationState } from '@tanstack/react-table';
import { Clock3, CreditCard, MapPin, UserRound } from 'lucide-react';

import { DataViewToolbar } from '../../../../../../components/DataViewToolbar.tsx';
import { LoadingState } from '../../../../../../components/LoadingState.tsx';
import { Pagination } from '../../../../../../components/Pagination.tsx';

import { AppointmentStatus } from '../../../../../../models/enums/appointment-status.ts';
import { appointmentStatusRecord } from '../../../../../../models/enums-mapping/appointment-status.ts';
import { paymentMethodRecord } from '../../../../../../models/enums-mapping/payment-method.ts';
import { paymentStatusRecord } from '../../../../../../models/enums-mapping/payment-status.ts';
import type { UserAppointmentResponse } from '../../../../../../models/appointment.model.ts';

const statusClasses: Record<string, string> = {
    [AppointmentStatus.PENDING_USER_CONFIRMATION]:
        'border-warning-border bg-warning-soft text-warning',
    [AppointmentStatus.PENDING_ORGANIZATION_APPROVAL]:
        'border-info-border bg-info-soft text-info',
    [AppointmentStatus.CONFIRMED]: 'border-success-border bg-success-soft text-success',
    [AppointmentStatus.IN_PROGRESS]:
        'border-status-accent-border bg-status-accent-soft text-status-accent',
    [AppointmentStatus.COMPLETED]: 'border-border bg-muted text-muted-foreground',
    [AppointmentStatus.REJECTED]: 'border-destructive-border bg-destructive-soft text-destructive',
    [AppointmentStatus.CANCELLED]: 'border-destructive-border bg-destructive-soft text-destructive',
    [AppointmentStatus.NO_SHOW]: 'border-border bg-muted text-muted-foreground',
};

interface CustomerAppointmentListProps {
    appointments: UserAppointmentResponse[];
    search: string;
    onSearchChange: (value: string) => void;
    filters?: ReactNode;
    actions?: ReactNode;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    rowCount: number;
    rowCountLabel: string;
    isLoading?: boolean;
}

export function CustomerAppointmentList({
    appointments,
    search,
    onSearchChange,
    filters,
    actions,
    pagination,
    onPaginationChange,
    rowCount,
    rowCountLabel,
    isLoading = false,
}: CustomerAppointmentListProps) {
    return (
        <div className="w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-border bg-card">
            <DataViewToolbar
                search={search}
                onSearchChange={onSearchChange}
                filters={filters}
                actions={actions}
            />

            {isLoading ? (
                <div className="p-3">
                    <LoadingState label="Loading appointments..." />
                </div>
            ) : appointments.length === 0 ? (
                <div className="flex min-h-56 items-center justify-center border-t border-border p-6 text-center">
                    <div>
                        <p className="text-sm font-semibold text-foreground">No appointments</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                            Appointments you book will appear here.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="divide-y divide-border border-t border-border">
                    {appointments.map((appointment) => (
                        <AppointmentListRow key={appointment.uuid} appointment={appointment} />
                    ))}
                </div>
            )}

            <div className="flex w-full min-w-0 items-center justify-between gap-3 border-t border-border bg-muted p-2">
                <span className="min-w-0 truncate text-[11px] font-medium text-muted-foreground">
                    {rowCountLabel}
                </span>

                <Pagination
                    pageIndex={pagination.pageIndex}
                    pageSize={pagination.pageSize}
                    rowCount={rowCount}
                    onPageChange={(nextPageIndex) =>
                        onPaginationChange((previous) => ({
                            ...previous,
                            pageIndex: nextPageIndex,
                        }))
                    }
                />
            </div>
        </div>
    );
}

function AppointmentListRow({ appointment }: { appointment: UserAppointmentResponse }) {
    const start = new Date(appointment.scheduledStartAtUTC);
    const end = new Date(appointment.scheduledEndAtUTC);

    const month = start.toLocaleDateString(undefined, { month: 'short' });
    const day = start.toLocaleDateString(undefined, { day: '2-digit' });

    const timeRange = `${start.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
    })} - ${end.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
    })}`;

    return (
        <article className="flex min-w-0 flex-col gap-3 px-3 py-3 transition-colors hover:bg-secondary/60 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-muted">
                    <span className="text-[9px] font-medium tracking-wide text-muted-foreground uppercase">
                        {month}
                    </span>

                    <span className="text-sm font-semibold text-foreground">{day}</span>
                </div>

                <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-1.5">
                        <p
                            className="truncate text-[12px] font-semibold text-foreground"
                            title={appointment.serviceName}
                        >
                            {appointment.serviceName}
                        </p>
                    </div>

                    <p
                        className="mt-0.5 truncate text-[10px] text-muted-foreground"
                        title={`${appointment.organizationName} · ${
                            appointment.userTitle || appointment.serviceName
                        }`}
                    >
                        {appointment.organizationName}
                        {' · '}
                        {appointment.userTitle || appointment.serviceName}
                    </p>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Clock3 className="size-3 shrink-0" strokeWidth={1.8} />
                            <span className="whitespace-nowrap">{timeRange}</span>
                        </span>

                        <span className="flex min-w-0 items-center gap-1">
                            <UserRound className="size-3 shrink-0" strokeWidth={1.8} />
                            <span className="truncate">
                                {appointment.workerName || 'Any worker'}
                            </span>
                        </span>

                        {appointment.roomName ? (
                            <span className="flex min-w-0 items-center gap-1">
                                <MapPin className="size-3 shrink-0" strokeWidth={1.8} />
                                <span className="truncate">{appointment.roomName}</span>
                            </span>
                        ) : null}

                        <span className="flex items-center gap-1">
                            <CreditCard className="size-3 shrink-0" strokeWidth={1.8} />
                            <span className="whitespace-nowrap">
                                {appointment.paymentMethod
                                    ? paymentMethodRecord[appointment.paymentMethod]
                                    : 'Not set'}
                                {' · '}
                                {paymentStatusRecord[appointment.paymentStatus]}
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-2 sm:flex-col sm:items-end">
                <span
                    className={[
                        'inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold whitespace-nowrap',
                        statusClasses[appointment.appointmentStatus] ??
                            'border-border bg-secondary text-secondary-foreground',
                    ].join(' ')}
                >
                    {appointmentStatusRecord[appointment.appointmentStatus]}
                </span>

                <Link
                    to={`/customer/appointments/${appointment.uuid}`}
                    className="inline-flex h-7 items-center justify-center rounded-lg border border-border bg-transparent px-2.5 text-[10px] font-semibold text-secondary-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                    Details
                </Link>
            </div>
        </article>
    );
}
