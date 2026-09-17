import {
    CalendarClock,
    CheckCircle2,
    CircleDollarSign,
    ClipboardList,
    DoorOpen,
    Info,
    Pencil,
    UserRound,
    Wrench,
} from 'lucide-react';
import { useState } from 'react';

import type { AppointmentResponse } from '../../../../../models/appointment.model.ts';

import { BackButton } from '../../../components/BackButton.tsx';
import { Button } from '../../../../../components/Button.tsx';

import { EditAppointmentDialog } from '../../components/EditAppointmentDialog.tsx';

interface AppointmentProfileProps {
    appointment: AppointmentResponse;
    organizationUuid: string;
    canManage?: boolean;
}

export function AppointmentProfile({
    appointment,
    organizationUuid,
    canManage = false,
}: AppointmentProfileProps) {
    const [editOpen, setEditOpen] = useState(false);

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-4">
            {/* Actions */}
            <div className="flex min-w-0 items-center justify-between gap-3">
                <BackButton backPath="/organization/appointments" />

                {canManage ? (
                    <Button
                        type="button"
                        onClick={() => setEditOpen(true)}
                        className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 px-3 text-[11px] font-semibold"
                    >
                        <Pencil className="size-3.5 transition-colors" strokeWidth={1.8} />
                        Edit
                    </Button>
                ) : null}
            </div>

            {/* Appointment Header */}
            <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
                <div className="flex min-w-0 items-start gap-4">
                    <div
                        className="mt-0.5 h-10 w-1 shrink-0 rounded-full"
                        style={{
                            backgroundColor: appointment.organizationColour || '#2563EB',
                        }}
                    />

                    <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <h1 className="min-w-0 truncate text-lg font-semibold text-[#343447]">
                                {appointment.serviceName}
                            </h1>

                            <StatusBadge status={appointment.appointmentStatus} />
                        </div>

                        <p className="mt-1 text-[11px] text-[#777789]">
                            Appointment for {appointment.name}
                        </p>
                    </div>
                </div>
            </section>

            {/* Appointment Information */}
            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                <InformationCard
                    title="Schedule"
                    description="Date and time of the appointment."
                    icon={<CalendarClock className="size-4" strokeWidth={1.8} />}
                >
                    <InfoRow label="Date" value={formatDate(appointment.scheduledStartAtUTC)} />

                    <InfoRow
                        label="Time"
                        value={`${formatTime(appointment.scheduledStartAtUTC)} – ${formatTime(
                            appointment.scheduledEndAtUTC,
                        )}`}
                    />
                </InformationCard>

                <InformationCard
                    title="Customer"
                    description="Customer associated with this appointment."
                    icon={<UserRound className="size-4" strokeWidth={1.8} />}
                >
                    <InfoRow label="Name" value={appointment.userName} />

                    <InfoRow label="Appointment" value={appointment.name} />
                </InformationCard>

                <InformationCard
                    title="Service"
                    description="Service selected for this appointment."
                    icon={<Wrench className="size-4" strokeWidth={1.8} />}
                >
                    <InfoRow label="Service" value={appointment.serviceName} />
                </InformationCard>

                <InformationCard
                    title="Worker & Room"
                    description="Resources assigned to this appointment."
                    icon={<DoorOpen className="size-4" strokeWidth={1.8} />}
                >
                    <InfoRow label="Worker" value={appointment.workerName} />

                    <InfoRow label="Room" value={appointment.roomName} />
                </InformationCard>

                <InformationCard
                    title="Payment"
                    description="Payment information for this appointment."
                    icon={<CircleDollarSign className="size-4" strokeWidth={1.8} />}
                >
                    <InfoRow label="Status" value={appointment.paymentStatus} />

                    <InfoRow label="Method" value={appointment.paymentMethod || 'No method'} />
                </InformationCard>

                <InformationCard
                    title="Appointment Status"
                    description="Current state of this appointment."
                    icon={<CheckCircle2 className="size-4" strokeWidth={1.8} />}
                >
                    <InfoRow label="Status" value={appointment.appointmentStatus} />
                </InformationCard>
            </div>

            {/* Notes */}
            <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
                <SectionHeader
                    title="Appointment Notes"
                    description="Notes associated with this appointment."
                    icon={<ClipboardList className="size-4" strokeWidth={1.8} />}
                />

                <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                    <NoteCard
                        title="Customer Note"
                        value={appointment.userNote || 'No customer note.'}
                    />

                    <NoteCard
                        title="Organization Note"
                        value={appointment.organizationNote || 'No organization note.'}
                    />
                </div>
            </section>

            {/* Rejection Reason */}
            {appointment.rejectionReason ? (
                <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
                    <SectionHeader
                        title="Rejection Reason"
                        description="Reason provided for rejecting this appointment."
                        icon={<Info className="size-4" strokeWidth={1.8} />}
                    />

                    <div className="mt-5 rounded-lg border border-[#d3d3df] bg-white p-3">
                        <p className="text-[11px] leading-5 text-[#777789]">
                            {appointment.rejectionReason}
                        </p>
                    </div>
                </section>
            ) : null}

            {/* Edit */}
            {canManage ? (
                <EditAppointmentDialog
                    organizationUuid={organizationUuid}
                    appointment={appointment}
                    open={editOpen}
                    onOpenChange={setEditOpen}
                />
            ) : null}
        </div>
    );
}

function InformationCard({
    title,
    description,
    icon,
    children,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="min-w-0 rounded-xl border border-[#d3d3df] bg-[#f5f5f8] p-5 text-left shadow-sm sm:p-6">
            <SectionHeader title={title} description={description} icon={icon} />

            <div className="mt-5 flex min-w-0 flex-col gap-4">{children}</div>
        </section>
    );
}

function SectionHeader({
    title,
    description,
    icon,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d3d3df] bg-[#ededf2] text-[#777789]">
                {icon}
            </div>

            <div className="min-w-0">
                <h2 className="text-[13px] font-semibold text-[#343447]">{title}</h2>

                <p className="mt-0.5 text-[10px] leading-4 text-[#777789]">{description}</p>
            </div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex min-w-0 items-center justify-between gap-4 border-b border-[#d3d3df] pb-2.5 last:border-b-0 last:pb-0">
            <p className="shrink-0 text-[9px] font-medium tracking-wide text-[#9999aa] uppercase">
                {label}
            </p>

            <p
                className="min-w-0 truncate text-right text-[11px] font-medium text-[#454556]"
                title={value || '—'}
            >
                {value || '—'}
            </p>
        </div>
    );
}

function NoteCard({ title, value }: { title: string; value: string }) {
    return (
        <div className="min-w-0 rounded-lg border border-[#d3d3df] bg-white p-3">
            <p className="mb-1 text-[9px] font-medium tracking-wide text-[#9999aa] uppercase">
                {title}
            </p>

            <p className="text-[11px] leading-5 text-[#777789]">{value}</p>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d3d3df] bg-[#ededf2] px-2 py-1 text-[9px] font-medium text-[#454556]">
            <span className="size-1.5 rounded-full bg-[#777789]" />
            {status}
        </span>
    );
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
