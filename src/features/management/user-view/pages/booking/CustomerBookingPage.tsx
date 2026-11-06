import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
    BriefcaseBusiness,
    Building2,
    CalendarClock,
    Check,
    Clock3,
    CreditCard,
} from 'lucide-react';

import { ManagementPage } from '../../../components/ManagementPage.tsx';
import { BackButton } from '../../../components/BackButton.tsx';
import { OrganizationSchedule } from '../../../components/OrganizationSchedule.tsx';
import { Button } from '../../../../../components/Button.tsx';
import { EntityImage } from '../../../../../components/EntityImage.tsx';
import { Select } from '../../../../../components/Select.tsx';
import { SearchableSelect } from '../../../../../components/SearchableSelect.tsx';
import { TextField } from '../../../../../components/TextField.tsx';

import { AppointmentAvailability } from '../../../appointments/components/AppointmentAvailability.tsx';

import { useService } from '../../../hooks/services-hook.ts';
import { useOrganization } from '../../../hooks/organization-hook.ts';
import { useCreateAppointment } from '../../../hooks/appointment-hook.ts';
import { useCurrentUser } from '../../../hooks/users-hook.ts';
import { useOrganizationWorkers } from '../../../hooks/scheduling-hook.ts';

import { AppointmentTimeType } from '../../../../../models/enums/appointment-time-type.ts';
import { appointmentTimeTypeRecord } from '../../../../../models/enums-mapping/appointment-time-type.ts';
import { PaymentMethod } from '../../../../../models/enums/payment-method.ts';
import { paymentMethodRecord } from '../../../../../models/enums-mapping/payment-method.ts';

import type { CreateAppointment } from '../../../../../models/appointment.model.ts';
import type { CreateAppointmentFormInput } from '../../../../../zod-schemas/appointment.schema.ts';

import {
    customerBookingFormSchema,
    type CustomerBookingFormInput,
    type CustomerBookingFormOutput,
} from '../../../../../zod-schemas/appointment.schema.ts';
import { getApiErrorMessage } from '../../../../../utlis/api-error.ts';

import { getCurrentDateTimeInTimeZone } from '../../utils/timezone.ts';

export function CustomerBookingPage() {
    const { serviceUuid } = useParams<{ serviceUuid: string }>();
    const navigate = useNavigate();

    const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();

    const {
        data: service,
        isLoading: serviceLoading,
        isError: serviceError,
    } = useService(serviceUuid ?? '');

    const { data: organization, isLoading: organizationLoading } = useOrganization(
        service?.organizationUuid ?? '',
    );

    const { data: workersData, isPending: workersLoading } = useOrganizationWorkers(
        service?.organizationUuid,
        Boolean(service),
    );

    const createMutation = useCreateAppointment();

    const organizationTimeZone = organization?.location.timezone ?? 'UTC';

    const defaultValues = useMemo<CustomerBookingFormInput>(
        () => ({
            userUuid: currentUser?.uuid ?? '',
            serviceUuid: serviceUuid ?? '',
            userTitle: service?.name ?? '',
            timeType: AppointmentTimeType.NEAREST,
            workerUuid: '',
            roomUuid: '',
            fromAtUTC: getCurrentDateTimeInTimeZone(organizationTimeZone),
            scheduledStartAtUTC: '',
            userNote: '',
            userColour: '#2563EB',
            paymentMethod: PaymentMethod.CASH,
        }),
        [currentUser?.uuid, serviceUuid, service?.name, organizationTimeZone],
    );

    const form = useForm<CustomerBookingFormInput, any, CustomerBookingFormOutput>({
        resolver: zodResolver(customerBookingFormSchema),
        defaultValues,
    });

    /*
     * The organization (and its timezone) loads after this form is created,
     * so the initial "now" may have been produced with the UTC fallback.
     * Re-align it once the real timezone is known, unless the user edited it.
     */
    const lastAutoFromAtRef = useRef<string | undefined>(defaultValues.fromAtUTC);
    const fromAtEditedRef = useRef(false);

    useEffect(() => {
        if (!organization) {
            return;
        }

        const current = form.getValues('fromAtUTC');

        if (current !== lastAutoFromAtRef.current) {
            fromAtEditedRef.current = true;
        }

        if (fromAtEditedRef.current) {
            return;
        }

        const next = getCurrentDateTimeInTimeZone(organizationTimeZone);

        if (current !== next) {
            form.setValue('fromAtUTC', next, { shouldValidate: false });
        }

        lastAutoFromAtRef.current = next;
    }, [organization, organizationTimeZone, form]);

    const timeType = form.watch('timeType');

    const [selectedAppointmentWorkerUuid, setSelectedAppointmentWorkerUuid] = useState<
        string | undefined
    >();

    useEffect(() => {
        form.setValue('userUuid', currentUser?.uuid ?? '', { shouldValidate: false });
        form.setValue('serviceUuid', serviceUuid ?? '', { shouldValidate: false });
    }, [form, currentUser?.uuid, serviceUuid]);

    useEffect(() => {
        if (!service?.name) {
            return;
        }

        form.setValue('userTitle', service.name, { shouldValidate: false });
    }, [form, service?.name]);

    const workerOptions = useMemo(
        () =>
            (workersData ?? []).map((worker) => ({
                value: worker.uuid,
                label: `${worker.firstName} ${worker.lastName}`,
            })),
        [workersData],
    );

    const isLoading = currentUserLoading || serviceLoading || organizationLoading;

    if (isLoading) {
        return <div className="p-5 text-sm text-muted-foreground">Loading booking details...</div>;
    }

    if (serviceError || !service) {
        return <div className="p-5 text-sm text-destructive">Failed to load this service.</div>;
    }

    if (!currentUser) {
        return <div className="p-5 text-sm text-destructive">Please log in to book an appointment.</div>;
    }

    async function handleSubmit(values: CustomerBookingFormOutput) {
        if (!service) {
            return;
        }

        const appointmentWorkerUuid =
            values.timeType === AppointmentTimeType.WORKER
                ? values.workerUuid
                : selectedAppointmentWorkerUuid;

        if (!appointmentWorkerUuid) {
            form.setError('scheduledStartAtUTC', {
                type: 'manual',
                message: 'Please select an available appointment time.',
            });

            return;
        }

        const payload: CreateAppointment = {
            organizationUuid: service.organizationUuid,
            userTitle: values.userTitle,
            serviceUuid: values.serviceUuid,
            timeType: values.timeType,
            workerUuid: appointmentWorkerUuid,
            scheduledStartAtUTC: values.scheduledStartAtUTC,
            userNote: values.userNote?.trim() ? values.userNote.trim() : undefined,
            userColour: values.userColour || undefined,
            paymentMethod: values.paymentMethod ?? undefined,
        };

        try {
            const appointment = await toast.promise(createMutation.mutateAsync(payload), {
                loading: 'Booking appointment...',
                success: 'Appointment booked successfully!',
                error: (mutationError) =>
                    getApiErrorMessage(mutationError, 'Failed to book this appointment.'),
            });

            navigate(`/customer/appointments/${appointment.uuid}`);
        } catch {
            // Error is shown by toast.promise.
        }
    }

    const errorClass = 'mt-1 text-[10px] text-destructive';

    return (
        <ManagementPage
            title="Book Appointment"
            description={[
                'Choose how you would like to schedule, then pick one of the available times.',
            ]}
        >
            <div className="flex min-w-0 flex-col gap-4">
                <div className="flex min-w-0 items-center justify-between gap-3">
                    <BackButton backPath="/customer/services" />
                </div>

                <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex min-w-0 flex-col gap-4"
                    >
                        {/* Appointment details */}
                        <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
                            <SectionHeader
                                title="Appointment Details"
                                description="Personalize your booking and choose a payment method."
                                icon={<CalendarClock className="size-4" strokeWidth={1.8} />}
                            />

                            <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                                <TextField
                                    label="Appointment Title"
                                    id="booking_title"
                                    placeholder="What is this appointment for?"
                                    errorMessage={form.formState.errors.userTitle?.message}
                                    {...form.register('userTitle')}
                                />

                                <Controller
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <Select
                                            label="Payment Method"
                                            id="booking_payment_method"
                                            value={field.value ?? ''}
                                            onChange={(event) =>
                                                field.onChange(
                                                    event.target.value === ''
                                                        ? undefined
                                                        : (event.target.value as PaymentMethod),
                                                )
                                            }
                                            hasError={Boolean(
                                                form.formState.errors.paymentMethod,
                                            )}
                                            errorMessage={
                                                form.formState.errors.paymentMethod?.message
                                            }
                                        >
                                            <option value="">Not selected</option>
                                            {Object.values(PaymentMethod).map((method) => (
                                                <option key={method} value={method}>
                                                    {paymentMethodRecord[method]}
                                                </option>
                                            ))}
                                        </Select>
                                    )}
                                />

                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="booking_note"
                                        className="text-[11px] font-medium text-foreground"
                                    >
                                        Note
                                        <span className="ml-1 font-normal text-muted-foreground">
                                            (Optional)
                                        </span>
                                    </label>

                                    <textarea
                                        id="booking_note"
                                        rows={3}
                                        maxLength={4096}
                                        placeholder="Anything the organization should know?"
                                        className="mt-1.5 w-full resize-y rounded-lg border border-border bg-card p-2.5 text-[11px] text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:border-ring"
                                        {...form.register('userNote')}
                                    />

                                    {form.formState.errors.userNote && (
                                        <p className={errorClass}>
                                            {form.formState.errors.userNote.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Scheduling */}
                        <section className="min-w-0 rounded-xl border border-border bg-card p-5 text-left shadow-sm sm:p-6">
                            <SectionHeader
                                title="Scheduling"
                                description="Find the nearest available time or choose a specific worker."
                                icon={<Clock3 className="size-4" strokeWidth={1.8} />}
                            />

                            <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                                <Controller
                                    control={form.control}
                                    name="timeType"
                                    render={({ field }) => (
                                        <Select
                                            label="Availability Type"
                                            id="booking_time_type"
                                            value={field.value}
                                            onChange={(event) =>
                                                field.onChange(
                                                    event.target.value as AppointmentTimeType,
                                                )
                                            }
                                        >
                                            <option value={AppointmentTimeType.NEAREST}>
                                                {
                                                    appointmentTimeTypeRecord[
                                                        AppointmentTimeType.NEAREST
                                                    ]
                                                }
                                            </option>
                                            <option value={AppointmentTimeType.WORKER}>
                                                {
                                                    appointmentTimeTypeRecord[
                                                        AppointmentTimeType.WORKER
                                                    ]
                                                }
                                            </option>
                                        </Select>
                                    )}
                                />

                                {timeType === AppointmentTimeType.NEAREST ? (
                                    <TextField
                                        label="Find Availability From"
                                        id="booking_from_at"
                                        type="datetime-local"
                                        errorMessage={form.formState.errors.fromAtUTC?.message}
                                        {...form.register('fromAtUTC')}
                                    />
                                ) : (
                                    <Controller
                                        control={form.control}
                                        name="workerUuid"
                                        render={({ field }) => (
                                            <SearchableSelect
                                                id="booking_worker"
                                                label="Worker"
                                                options={workerOptions}
                                                value={field.value ?? ''}
                                                placeholder={
                                                    workersLoading
                                                        ? 'Loading workers...'
                                                        : 'Select a worker'
                                                }
                                                searchPlaceholder="Search workers..."
                                                hasError={Boolean(
                                                    form.formState.errors.workerUuid,
                                                )}
                                                errorMessage={
                                                    form.formState.errors.workerUuid?.message
                                                }
                                                onChange={(event) =>
                                                    field.onChange(event.target.value)
                                                }
                                                onBlur={field.onBlur}
                                                className="h-8 px-2.5 text-[11px]"
                                            />
                                        )}
                                    />
                                )}
                            </div>

                            <div className="mt-4 min-w-0">
                                <AppointmentAvailability
                                    organizationUuid={service.organizationUuid}
                                    organizationTimeZone={organizationTimeZone}
                                    form={
                                        form as unknown as UseFormReturn<CreateAppointmentFormInput>
                                    }
                                    onAppointmentWorkerChange={setSelectedAppointmentWorkerUuid}
                                />

                                {form.formState.errors.scheduledStartAtUTC && (
                                    <p className={errorClass}>
                                        {form.formState.errors.scheduledStartAtUTC.message}
                                    </p>
                                )}
                            </div>

                            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    onClick={() => navigate('/customer/services')}
                                    disabled={createMutation.isPending}
                                    className="h-8 w-full border border-border bg-transparent px-3 text-[11px] font-semibold text-secondary-foreground hover:bg-secondary hover:text-foreground sm:w-auto"
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="flex h-8 w-full items-center justify-center gap-1.5 px-3 text-[11px] font-semibold sm:w-auto"
                                >
                                    <Check className="size-3.5" strokeWidth={2} />
                                    {createMutation.isPending ? 'Booking...' : 'Book Appointment'}
                                </Button>
                            </div>
                        </section>
                    </form>

                    {/* Service summary */}
                    <aside className="min-w-0 self-start rounded-xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-4">
                        <EntityImage
                            src={service.servicePicturePath || service.profilePicturePath}
                            alt={service.name}
                            icon={BriefcaseBusiness}
                            className="flex size-12 items-center justify-center overflow-hidden rounded-lg bg-secondary text-muted-foreground"
                            iconClassName="size-6"
                        />

                        <h2 className="mt-3 text-sm font-semibold text-foreground">
                            {service.name}
                        </h2>

                        <div className="mt-2 flex min-w-0 items-center gap-1.5 text-muted-foreground">
                            <Building2 className="size-3.5 shrink-0" strokeWidth={1.8} />
                            <span className="truncate text-[11px]">
                                {service.organizationName}
                            </span>
                        </div>

                        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3 text-[11px]">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Price</span>
                                <span className="font-semibold text-foreground">
                                    {service.price}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Duration</span>
                                <span className="font-semibold text-foreground">
                                    {service.durationInMinutes} min
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Timezone</span>
                                <span className="max-w-40 truncate text-right font-medium text-secondary-foreground">
                                    {organizationTimeZone}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-card p-3">
                            <CreditCard className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                            <p className="text-[10px] leading-4 text-muted-foreground">
                                You can update the payment method later. The organization will
                                review the appointment after it is booked.
                            </p>
                        </div>
                    </aside>
                </div>

                <OrganizationSchedule
                    organizationUuid={service.organizationUuid}
                    timeZone={organizationTimeZone}
                />
            </div>
        </ManagementPage>
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
