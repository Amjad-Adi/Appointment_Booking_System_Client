import {
    Building2,
    CalendarClock,
    CheckCircle2,
    CircleDollarSign,
    ClipboardList,
    DoorOpen,
    Info,
    Pencil,
    Play,
    Send,
    Star,
    UserRound,
    UserX,
    Wallet,
    XCircle,
    Wrench,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type {
    OrganizationAppointmentResponse,
    UserAppointmentResponse,
} from '../../../../../models/appointment.model.ts';

import { BackButton } from '../../../components/BackButton.tsx';
import { Button } from '../../../../../components/Button.tsx';
import {
    CreateDialog,
    type CreateDialogField,
} from '../../../../../components/CreateDialog.tsx';

import { EditAppointmentDialog } from '../../components/EditAppointmentDialog.tsx';
import { EditUserAppointmentDialog } from '../../components/EditUserAppointmentDialog.tsx';
import { useCurrentUser } from '../../../hooks/users-hook.ts';
import {
    useCancelAppointment,
    useUpdateOrganizationAppointment,
} from '../../../hooks/appointment-hook.ts';
import { useCreateReview, useReviews } from '../../../hooks/review-hook.ts';
import { Role } from '../../../../../models/enums/roles.ts';
import { AppointmentStatus } from '../../../../../models/enums/appointment-status.ts';
import { PaymentStatus } from '../../../../../models/enums/payment-status.ts';
import { appointmentStatusRecord } from '../../../../../models/enums-mapping/appointment-status.ts';
import { paymentMethodRecord } from '../../../../../models/enums-mapping/payment-method.ts';
import { paymentStatusRecord } from '../../../../../models/enums-mapping/payment-status.ts';
import { getApiErrorMessage } from '../../../../../utlis/api-error.ts';

const createReviewFormSchema = z.object({
    rating: z.coerce
        .number({ error: 'Rating is required' })
        .int({ error: 'Rating must be a whole number' })
        .min(1, { error: 'Rating must be at least 1' })
        .max(5, { error: 'Rating must be at most 5' }),
    comment: z
        .string()
        .trim()
        .min(3, { error: 'Comment must be at least 3 characters' })
        .max(4096, { error: 'Comment must be at most 4096 characters' }),
});

type CreateReviewForm = z.output<typeof createReviewFormSchema>;
type CreateReviewFormInput = z.input<typeof createReviewFormSchema>;

const reviewFields: CreateDialogField<CreateReviewFormInput>[] = [
    {
        name: 'rating',
        label: 'Rating',
        type: 'select',
        placeholder: 'Select a rating',
        options: [5, 4, 3, 2, 1].map((value) => ({
            value: String(value),
            label: `${value} star${value === 1 ? '' : 's'}`,
        })),
    },
    {
        name: 'comment',
        label: 'Comment',
        type: 'custom',
        render: (form) => (
            <div className="flex flex-col">
                <label
                    htmlFor="review_comment"
                    className="mb-1.5 text-[11px] font-medium text-foreground"
                >
                    Comment
                </label>
                <textarea
                    id="review_comment"
                    rows={4}
                    maxLength={4096}
                    placeholder="Tell others about your experience..."
                    className="w-full resize-y rounded-lg border border-border bg-card p-2.5 text-[11px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
                    {...form.register('comment')}
                />
            </div>
        ),
    },
];

interface AppointmentProfileProps {
    appointment: OrganizationAppointmentResponse | UserAppointmentResponse;
    organizationUuid: string;
    canManage?: boolean;
}

// Type guard to narrow the appointment type safely
function isOrganizationAppointment(
    appointment: OrganizationAppointmentResponse | UserAppointmentResponse,
): appointment is OrganizationAppointmentResponse {
    return 'organizationColour' in appointment;
}

export function AppointmentProfile({
    appointment,
    organizationUuid,
    canManage = false,
}: AppointmentProfileProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [userEditOpen, setUserEditOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [reviewOpen, setReviewOpen] = useState(false);
    const { data: currentUser } = useCurrentUser();

    const cancelMutation = useCancelAppointment();
    const updateMutation = useUpdateOrganizationAppointment(organizationUuid);
    const createReviewMutation = useCreateReview();

    const isCustomer = currentUser?.role === Role.CUSTOMER;
    const isCompleted = appointment.appointmentStatus === AppointmentStatus.COMPLETED;

    const { data: existingReviews } = useReviews(
        {
            page: 1,
            limit: 1,
            filter: { appointmentUuid: appointment.uuid },
        },
        isCustomer && isCompleted,
    );

    const alreadyReviewed = (existingReviews?.data?.length ?? 0) > 0;

    const isOrgMember =
        currentUser?.role !== Role.SUPER_ADMIN && currentUser?.role !== Role.CUSTOMER;

    const isOrgApp = isOrganizationAppointment(appointment);

    // Normalize properties based on appointment interface
    const title = isOrgApp ? appointment.organizationTitle : appointment.userTitle;
    const note = isOrgApp ? appointment.organizationNote : appointment.userNote;
    const colour = isOrgApp ? appointment.organizationColour : appointment.userColour;
    const noteLabel = isOrgApp ? 'Organization Note' : 'User Note';

    const backPath = isOrgMember ? '/organization/appointments' : '/customer/appointments';
    const canEdit = canManage && isOrgMember && isOrgApp;
    const canEditUser = isCustomer && !isOrgApp;

    /*
     * Customers can only cancel before the appointment starts. Once it is
     * in progress, only the organization can close it.
     */
    const cancellableStatuses = [
        AppointmentStatus.PENDING_USER_CONFIRMATION,
        AppointmentStatus.PENDING_ORGANIZATION_APPROVAL,
        AppointmentStatus.CONFIRMED,
    ];

    const canCancel = isCustomer && cancellableStatuses.includes(appointment.appointmentStatus);

    /*
     * The clock is read in an effect to keep render pure, and refreshed so
     * start/no-show actions appear once the scheduled start passes.
     */
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        const update = () => setNow(Date.now());
        update();
        const intervalId = window.setInterval(update, 60_000);
        return () => window.clearInterval(intervalId);
    }, []);

    const hasStarted =
        now !== null && now >= Date.parse(appointment.scheduledStartAtUTC);

    const hasEnded = now !== null && now >= Date.parse(appointment.scheduledEndAtUTC);

    const canAdvance =
        canManage &&
        isOrgApp &&
        appointment.appointmentStatus === AppointmentStatus.PENDING_USER_CONFIRMATION;

    const canConfirm =
        canManage &&
        isOrgApp &&
        appointment.appointmentStatus === AppointmentStatus.PENDING_ORGANIZATION_APPROVAL;

    const canReject = canConfirm;

    const canStart =
        canManage &&
        isOrgApp &&
        hasStarted &&
        appointment.appointmentStatus === AppointmentStatus.CONFIRMED;

    const canMarkNoShow = canStart;

    const canComplete =
        canManage &&
        isOrgApp &&
        hasEnded &&
        appointment.appointmentStatus === AppointmentStatus.IN_PROGRESS;

    const canTogglePayment =
        canManage && isOrgApp && appointment.appointmentStatus === AppointmentStatus.CONFIRMED;

    const handleCancel = async () => {
        if (!window.confirm('Cancel this appointment?')) {
            return;
        }

        try {
            await toast.promise(cancelMutation.mutateAsync(appointment.uuid), {
                loading: 'Cancelling appointment...',
                success: 'Appointment cancelled',
                error: (mutationError) =>
                    getApiErrorMessage(mutationError, 'Failed to cancel appointment'),
            });
        } catch {
            // The error is surfaced by toast.promise.
        }
    };

    const handleAdvance = async () => {
        try {
            await toast.promise(
                updateMutation.mutateAsync({
                    uuid: appointment.uuid,
                    appointmentStatus: AppointmentStatus.PENDING_ORGANIZATION_APPROVAL,
                }),
                {
                    loading: 'Updating appointment...',
                    success: 'Appointment moved to organization review',
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to update appointment'),
                },
            );
        } catch {
            // The error is surfaced by toast.promise.
        }
    };

    const handleConfirm = async () => {
        if (isOrgApp && !appointment.organizationTitle?.trim()) {
            toast.error('Add an organization title before confirming this appointment.');
            setEditOpen(true);
            return;
        }

        try {
            await toast.promise(
                updateMutation.mutateAsync({
                    uuid: appointment.uuid,
                    appointmentStatus: AppointmentStatus.CONFIRMED,
                }),
                {
                    loading: 'Confirming appointment...',
                    success: 'Appointment confirmed',
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to confirm appointment'),
                },
            );
        } catch {
            // The error is surfaced by toast.promise.
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error('A rejection reason is required.');
            return;
        }

        try {
            await toast.promise(
                updateMutation.mutateAsync({
                    uuid: appointment.uuid,
                    appointmentStatus: AppointmentStatus.REJECTED,
                    rejectionReason: rejectionReason.trim(),
                }),
                {
                    loading: 'Rejecting appointment...',
                    success: 'Appointment rejected',
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to reject appointment'),
                },
            );

            setRejectOpen(false);
            setRejectionReason('');
        } catch {
            // The error is surfaced by toast.promise.
        }
    };

    const handleStatusUpdate = async (
        nextStatus: AppointmentStatus,
        successMessage: string,
    ) => {
        try {
            await toast.promise(
                updateMutation.mutateAsync({
                    uuid: appointment.uuid,
                    appointmentStatus: nextStatus,
                }),
                {
                    loading: 'Updating appointment...',
                    success: successMessage,
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to update appointment'),
                },
            );
        } catch {
            // The error is surfaced by toast.promise.
        }
    };

    const handlePaymentToggle = async () => {
        const nextStatus =
            appointment.paymentStatus === PaymentStatus.PAID
                ? PaymentStatus.UNPAID
                : PaymentStatus.PAID;

        try {
            await toast.promise(
                updateMutation.mutateAsync({
                    uuid: appointment.uuid,
                    paymentStatus: nextStatus,
                }),
                {
                    loading: 'Updating payment...',
                    success: `Appointment marked as ${paymentStatusRecord[nextStatus]}`,
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to update payment'),
                },
            );
        } catch {
            // The error is surfaced by toast.promise.
        }
    };

    const handleCreateReview = async (values: CreateReviewForm) => {
        try {
            await toast.promise(
                createReviewMutation.mutateAsync({
                    appointmentUuid: appointment.uuid,
                    rating: values.rating,
                    comment: values.comment,
                }),
                {
                    loading: 'Submitting review...',
                    success: 'Review submitted',
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to submit review'),
                },
            );

            setReviewOpen(false);
        } catch {
            // The error is surfaced by toast.promise.
        }
    };

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-4">
            {/* Actions */}
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                <BackButton backPath={backPath} />

                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    {canAdvance ? (
                        <Button
                            type="button"
                            onClick={handleAdvance}
                            disabled={updateMutation.isPending}
                            className="flex h-8 w-auto items-center justify-center gap-1.5 px-3 text-[11px] font-semibold"
                        >
                            <Send className="size-3.5" strokeWidth={1.8} />
                            Send to Review
                        </Button>
                    ) : null}

                    {canConfirm ? (
                        <Button
                            type="button"
                            onClick={handleConfirm}
                            disabled={updateMutation.isPending}
                            className="flex h-8 w-auto items-center justify-center gap-1.5 px-3 text-[11px] font-semibold"
                        >
                            <CheckCircle2 className="size-3.5" strokeWidth={1.8} />
                            Confirm
                        </Button>
                    ) : null}

                    {canReject ? (
                        <Button
                            type="button"
                            onClick={() => setRejectOpen(true)}
                            disabled={updateMutation.isPending}
                            className="flex h-8 w-auto items-center justify-center gap-1.5 border border-destructive/40 bg-transparent px-3 text-[11px] font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                            <XCircle className="size-3.5" strokeWidth={1.8} />
                            Reject
                        </Button>
                    ) : null}

                    {canStart ? (
                        <Button
                            type="button"
                            onClick={() =>
                                handleStatusUpdate(
                                    AppointmentStatus.IN_PROGRESS,
                                    'Appointment started',
                                )
                            }
                            disabled={updateMutation.isPending}
                            className="flex h-8 w-auto items-center justify-center gap-1.5 px-3 text-[11px] font-semibold"
                        >
                            <Play className="size-3.5" strokeWidth={1.8} />
                            Start Appointment
                        </Button>
                    ) : null}

                    {canMarkNoShow ? (
                        <Button
                            type="button"
                            onClick={() =>
                                handleStatusUpdate(
                                    AppointmentStatus.NO_SHOW,
                                    'Appointment marked as no-show',
                                )
                            }
                            disabled={updateMutation.isPending}
                            className="flex h-8 w-auto items-center justify-center gap-1.5 border border-border bg-transparent px-3 text-[11px] font-semibold text-secondary-foreground hover:bg-secondary hover:text-foreground"
                        >
                            <UserX className="size-3.5" strokeWidth={1.8} />
                            Mark No Show
                        </Button>
                    ) : null}

                    {canComplete ? (
                        <Button
                            type="button"
                            onClick={() =>
                                handleStatusUpdate(
                                    AppointmentStatus.COMPLETED,
                                    'Appointment completed',
                                )
                            }
                            disabled={updateMutation.isPending}
                            className="flex h-8 w-auto items-center justify-center gap-1.5 px-3 text-[11px] font-semibold"
                        >
                            <CheckCircle2 className="size-3.5" strokeWidth={1.8} />
                            Complete Appointment
                        </Button>
                    ) : null}

                    {canTogglePayment ? (
                        <Button
                            type="button"
                            onClick={handlePaymentToggle}
                            disabled={updateMutation.isPending}
                            className="flex h-8 w-auto items-center justify-center gap-1.5 border border-border bg-transparent px-3 text-[11px] font-semibold text-secondary-foreground hover:bg-secondary hover:text-foreground"
                        >
                            <Wallet className="size-3.5" strokeWidth={1.8} />
                            {appointment.paymentStatus === PaymentStatus.PAID
                                ? 'Mark Unpaid'
                                : 'Mark Paid'}
                        </Button>
                    ) : null}

                    {canCancel ? (
                        <Button
                            type="button"
                            onClick={handleCancel}
                            disabled={cancelMutation.isPending}
                            className="flex h-8 w-auto items-center justify-center gap-1.5 border border-destructive/40 bg-transparent px-3 text-[11px] font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                            <XCircle className="size-3.5" strokeWidth={1.8} />
                            Cancel Appointment
                        </Button>
                    ) : null}

                    {isCustomer && isCompleted && hasEnded ? (
                        alreadyReviewed ? (
                            <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 text-[11px] font-semibold text-muted-foreground">
                                <Star className="size-3.5" fill="currentColor" strokeWidth={1.8} />
                                Reviewed
                            </span>
                        ) : (
                            <Button
                                type="button"
                                onClick={() => setReviewOpen(true)}
                                className="flex h-8 w-auto items-center justify-center gap-1.5 px-3 text-[11px] font-semibold"
                            >
                                <Star className="size-3.5" strokeWidth={1.8} />
                                Write Review
                            </Button>
                        )
                    ) : null}

                    {canEdit ? (
                        <Button
                            type="button"
                            onClick={() => setEditOpen(true)}
                            className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 px-3 text-[11px] font-semibold"
                        >
                            <Pencil className="size-3.5 transition-colors" strokeWidth={1.8} />
                            Edit
                        </Button>
                    ) : null}

                    {canEditUser ? (
                        <Button
                            type="button"
                            onClick={() => setUserEditOpen(true)}
                            className="group flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 px-3 text-[11px] font-semibold"
                        >
                            <Pencil className="size-3.5 transition-colors" strokeWidth={1.8} />
                            Edit
                        </Button>
                    ) : null}
                </div>
            </div>

            {/* Appointment Header */}
            <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
                <div className="flex min-w-0 items-start gap-4">
                    <div
                        className="mt-0.5 h-10 w-1 shrink-0 rounded-full"
                        style={{
                            backgroundColor: colour || 'var(--appointment-default)',
                        }}
                    />

                    <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <h1 className="min-w-0 truncate text-lg font-semibold text-foreground">
                                {appointment.serviceName}
                            </h1>

                            <StatusBadge status={appointment.appointmentStatus} />
                        </div>

                        <p className="mt-1 truncate text-[11px] text-muted-foreground">
                            {title || 'Untitled appointment'}
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
                        value={`${formatTime(appointment.scheduledStartAtUTC)} - ${formatTime(
                            appointment.scheduledEndAtUTC,
                        )}`}
                    />
                </InformationCard>

                {isOrgMember ? (
                    <InformationCard
                        title="Customer"
                        description="Customer associated with this appointment."
                        icon={<UserRound className="size-4" strokeWidth={1.8} />}
                    >
                        <InfoRow label="Name" value={appointment.userName} />
                        <InfoRow label="Title" value={title} />
                    </InformationCard>
                ) : (
                    <InformationCard
                        title="Organization"
                        description="Organization providing this service."
                        icon={<Building2 className="size-4" strokeWidth={1.8} />}
                    >
                        <InfoRow label="Name" value={appointment.organizationName} />
                    </InformationCard>
                )}

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
                    {isOrgApp && appointment.approvalUserName ? (
                        <InfoRow label="Approved By" value={appointment.approvalUserName} />
                    ) : null}
                </InformationCard>

                <InformationCard
                    title="Payment"
                    description="Payment information for this appointment."
                    icon={<CircleDollarSign className="size-4" strokeWidth={1.8} />}
                >
                    <InfoRow
                        label="Status"
                        value={paymentStatusRecord[appointment.paymentStatus]}
                    />
                    <InfoRow
                        label="Method"
                        value={
                            appointment.paymentMethod
                                ? paymentMethodRecord[appointment.paymentMethod]
                                : 'No method'
                        }
                    />
                </InformationCard>

                <InformationCard
                    title="Appointment Status"
                    description="Current state of this appointment."
                    icon={<CheckCircle2 className="size-4" strokeWidth={1.8} />}
                >
                    <InfoRow
                        label="Status"
                        value={appointmentStatusRecord[appointment.appointmentStatus]}
                    />
                </InformationCard>
            </div>

            {/* Notes */}
            {note ? (
                <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
                    <SectionHeader
                        title="Appointment Notes"
                        description="Notes associated with this appointment."
                        icon={<ClipboardList className="size-4" strokeWidth={1.8} />}
                    />

                    <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                        <NoteCard title={noteLabel} value={note} />
                    </div>
                </section>
            ) : null}

            {/* Rejection Reason */}
            {appointment.rejectionReason ? (
                <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
                    <SectionHeader
                        title="Rejection Reason"
                        description="Reason provided for rejecting this appointment."
                        icon={<Info className="size-4" strokeWidth={1.8} />}
                    />

                    <div className="mt-5 rounded-lg border border-border bg-card p-3">
                        <p className="text-[11px] leading-5 text-muted-foreground">
                            {appointment.rejectionReason}
                        </p>
                    </div>
                </section>
            ) : null}

            {/* Edit */}
            {canEdit && isOrganizationAppointment(appointment) ? (
                <EditAppointmentDialog
                    organizationUuid={organizationUuid}
                    appointment={appointment}
                    open={editOpen}
                    onOpenChange={setEditOpen}
                />
            ) : null}

            {canEditUser && !isOrganizationAppointment(appointment) ? (
                <EditUserAppointmentDialog
                    appointment={appointment}
                    open={userEditOpen}
                    onOpenChange={setUserEditOpen}
                />
            ) : null}

            {/* Reject */}
            {canReject && rejectOpen ? (
                <div
                    className="fixed inset-0 z-200 flex items-center justify-center bg-overlay px-4 py-4 backdrop-blur-[2px]"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl">
                        <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                            Reject Appointment
                        </h2>

                        <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                            Explain why this appointment cannot be accepted. The customer will see
                            this reason.
                        </p>

                        <textarea
                            rows={4}
                            maxLength={4096}
                            value={rejectionReason}
                            onChange={(event) => setRejectionReason(event.target.value)}
                            placeholder="Rejection reason"
                            className="mt-4 w-full resize-y rounded-lg border border-border bg-card p-2.5 text-[11px] text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:border-ring"
                        />

                        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                onClick={() => {
                                    setRejectOpen(false);
                                    setRejectionReason('');
                                }}
                                disabled={updateMutation.isPending}
                                className="h-8 w-full border border-border bg-transparent px-3 text-[11px] font-semibold text-secondary-foreground hover:bg-secondary hover:text-foreground sm:w-auto"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="button"
                                onClick={handleReject}
                                disabled={updateMutation.isPending}
                                className="h-8 w-full border border-destructive/40 bg-destructive px-3 text-[11px] font-semibold text-destructive-foreground hover:bg-destructive/90 sm:w-auto"
                            >
                                Reject Appointment
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}

            <CreateDialog<CreateReviewFormInput, CreateReviewForm>
                key={`review-appointment-${reviewOpen}`}
                open={reviewOpen}
                onOpenChange={setReviewOpen}
                title="Write a Review"
                description={`Share your experience with ${appointment.serviceName}.`}
                resolver={zodResolver(createReviewFormSchema)}
                defaultValues={{ rating: 5, comment: '' }}
                fields={reviewFields}
                submitLabel="Submit Review"
                onSubmit={handleCreateReview}
            />
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
        <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
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
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground">
                {icon}
            </div>

            <div className="min-w-0">
                <h2 className="text-[13px] font-semibold text-foreground">{title}</h2>

                <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex min-w-0 items-center justify-between gap-4 border-b border-border pb-2.5 last:border-b-0 last:pb-0">
            <p className="shrink-0 text-[9px] font-medium tracking-wide text-muted-foreground uppercase">
                {label}
            </p>

            <p
                className="min-w-0 truncate text-right text-[11px] font-medium text-secondary-foreground"
                title={value || '—'}
            >
                {value || '—'}
            </p>
        </div>
    );
}

function NoteCard({ title, value }: { title: string; value: string }) {
    return (
        <div className="min-w-0 rounded-lg border border-border bg-card p-3">
            <p className="mb-1 text-[9px] font-medium tracking-wide text-muted-foreground uppercase">
                {title}
            </p>

            <p className="text-[11px] leading-5 text-muted-foreground">{value}</p>
        </div>
    );
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2 py-1 text-[9px] font-medium text-secondary-foreground">
            <span className="size-1.5 rounded-full bg-muted-foreground" />
            {appointmentStatusRecord[status]}
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
