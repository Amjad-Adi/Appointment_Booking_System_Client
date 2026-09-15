import {
    CalendarClock,
    CircleDollarSign,
    ClipboardList,
    DoorOpen,
    Info,
    UserRound,
    Wrench,
} from 'lucide-react';

import type { AppointmentResponse } from '../../../../../models/appointment.model.ts';

import { BackButton } from '../../../components/BackButton.tsx';

interface AppointmentProfileProps {
    appointment: AppointmentResponse;
    canManage?: boolean;
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function formatTime(value: string) {
    return new Date(value).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function AppointmentProfile({ appointment }: AppointmentProfileProps) {
    return (
        <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex min-w-0 items-center justify-between gap-3">
                <BackButton backPath="/organization/appointments" />
            </div>

            <section className="overflow-hidden rounded-xl border border-[#d3d3df] bg-white shadow-sm">
                <div
                    className="h-2"
                    style={{
                        backgroundColor: appointment.organizationColour || '#2563EB',
                    }}
                />

                <div className="p-5">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h1 className="min-w-0 truncate text-xl font-semibold text-[#343447]">
                            {appointment.serviceName}
                        </h1>

                        <span className="rounded-full bg-[#ededf2] px-2.5 py-1 text-[10px] font-medium text-[#343447]">
                            {appointment.appointmentStatus}
                        </span>
                    </div>

                    <p className="mt-1 text-[11px] text-[#777789]">{appointment.name}</p>
                </div>
            </section>

            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <section className="rounded-xl border border-[#d3d3df] bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#ededf2]">
                            <CalendarClock className="size-4 text-[#777789]" strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium tracking-wide text-[#777789] uppercase">
                                Schedule
                            </p>

                            <p className="mt-0.5 truncate text-sm font-semibold text-[#343447]">
                                {formatDate(appointment.scheduledStartAtUTC)}
                            </p>

                            <p className="text-[11px] text-[#777789]">
                                {formatTime(appointment.scheduledStartAtUTC)} –{' '}
                                {formatTime(appointment.scheduledEndAtUTC)}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-[#d3d3df] bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#ededf2]">
                            <UserRound className="size-4 text-[#777789]" strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium tracking-wide text-[#777789] uppercase">
                                Customer
                            </p>

                            <p className="mt-0.5 truncate text-lg font-semibold text-[#343447]">
                                {appointment.userName}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-[#d3d3df] bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#ededf2]">
                            <Wrench className="size-4 text-[#777789]" strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium tracking-wide text-[#777789] uppercase">
                                Worker
                            </p>

                            <p className="mt-0.5 truncate text-lg font-semibold text-[#343447]">
                                {appointment.workerName}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-[#d3d3df] bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#ededf2]">
                            <DoorOpen className="size-4 text-[#777789]" strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium tracking-wide text-[#777789] uppercase">
                                Room
                            </p>

                            <p className="mt-0.5 truncate text-lg font-semibold text-[#343447]">
                                {appointment.roomName}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-[#d3d3df] bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#ededf2]">
                            <CircleDollarSign className="size-4 text-[#777789]" strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium tracking-wide text-[#777789] uppercase">
                                Payment
                            </p>

                            <p className="mt-0.5 truncate text-lg font-semibold text-[#343447]">
                                {appointment.paymentStatus}
                            </p>

                            <p className="text-[11px] text-[#777789]">
                                {appointment.paymentMethod || 'No method'}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <section className="rounded-xl border border-[#d3d3df] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#ededf2]">
                        <ClipboardList className="size-4 text-[#777789]" strokeWidth={1.8} />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-[#343447]">Appointment Notes</h2>

                        <p className="text-[10px] text-[#777789]">
                            Notes associated with this appointment
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <div className="rounded-lg border border-[#d3d3df] bg-[#f5f5f8] p-3">
                        <p className="mb-1 text-[10px] font-medium text-[#777789] uppercase">
                            Customer Note
                        </p>

                        <p className="text-[11px] leading-5 text-[#777789]">
                            {appointment.userNote || 'No customer note.'}
                        </p>
                    </div>

                    <div className="rounded-lg border border-[#d3d3df] bg-[#f5f5f8] p-3">
                        <p className="mb-1 text-[10px] font-medium text-[#777789] uppercase">
                            Organization Note
                        </p>

                        <p className="text-[11px] leading-5 text-[#777789]">
                            {appointment.organizationNote || 'No organization note.'}
                        </p>
                    </div>
                </div>
            </section>

            {appointment.rejectionReason ? (
                <section className="rounded-xl border border-[#d3d3df] bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Info className="size-4 text-[#777789]" />

                        <h2 className="text-sm font-semibold text-[#343447]">Rejection Reason</h2>
                    </div>

                    <div className="mt-3 rounded-lg border border-[#d3d3df] bg-[#f5f5f8] p-3">
                        <p className="text-[11px] leading-5 text-[#777789]">
                            {appointment.rejectionReason}
                        </p>
                    </div>
                </section>
            ) : null}
        </div>
    );
}
