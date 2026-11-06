import { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';

import toast from 'react-hot-toast';

import { CreateDialog, type CreateDialogField } from '../../../../components/CreateDialog.tsx';

import { useCreateOrganizationAppointment } from '../../hooks/appointment-hook.ts';

import { useOrganizationCustomers } from '../../hooks/users-hook.ts';

import { useOrganizationWorkers } from '../../hooks/scheduling-hook.ts';

import { useOrganizationServices } from '../../hooks/services-hook.ts';

import {
    createAppointmentFormSchema,
    createOrganizationAppointmentSchema,
    type CreateAppointmentFormInput,
    type CreateAppointmentFormOutput,
} from '../../../../zod-schemas/appointment.schema.ts';

import { ActivationStatus } from '../../../../models/enums/activation-status.ts';

import { PaymentMethod } from '../../../../models/enums/payment-method.ts';
import { getApiErrorMessage, getApiFieldErrors } from '../../../../utlis/api-error.ts';

import { AppointmentTimeType } from '../../../../models/enums/appointment-time-type.ts';
import { appointmentTimeTypeRecord } from '../../../../models/enums-mapping/appointment-time-type.ts';
import { paymentMethodRecord } from '../../../../models/enums-mapping/payment-method.ts';

import { PAGE_SIZE } from '../../../../components/DataTableFeatures.ts';

import { GENERAL_DEBOUNCE_DELAY, useDebounce } from '../../../../hooks/deounce.ts';

import { AppointmentAvailability } from './AppointmentAvailability.tsx';

import { OrganizationTimeInfo } from '../../super-admin-view/pages/organizations/organization-profile/components/OrganizationTimeInfo.tsx';

import { organizationDateToLocalDateTime } from '../../user-view/utils/timezone.ts';

interface CreateAppointmentDialogProps {
    organizationUuid?: string;

    organizationTimeZone: string;

    open: boolean;

    onOpenChange: (open: boolean) => void;

    selectedDate?: Date;

    selectedTime?: Date;

    selectedWorkerUuid?: string;
}

function getDefaultStart(
    selectedDate: Date | undefined,
    selectedTime: Date | undefined,
    timeZone: string,
): string {
    const startAt = selectedTime ?? selectedDate ?? new Date();

    return organizationDateToLocalDateTime(startAt, timeZone);
}

export function CreateAppointmentDialog({
    organizationUuid,
    organizationTimeZone,
    open,
    onOpenChange,
    selectedDate,
    selectedTime,
    selectedWorkerUuid: initialSelectedWorkerUuid,
}: CreateAppointmentDialogProps) {
    const createMutation = useCreateOrganizationAppointment(organizationUuid);

    const [customerSearch, setCustomerSearch] = useState('');

    const [serviceSearch, setServiceSearch] = useState('');

    const [workerSearch, setWorkerSearch] = useState('');

    /*
     * This is the worker that will actually receive the
     * appointment.
     *
     * In NEAREST mode it is set only after the user selects
     * an availability option.
     *
     * In WORKER mode it follows the worker selected in the form.
     */
    const [selectedAppointmentWorkerUuid, setSelectedAppointmentWorkerUuid] = useState<
        string | undefined
    >(initialSelectedWorkerUuid);

    const debouncedCustomerSearch = useDebounce(customerSearch, GENERAL_DEBOUNCE_DELAY);

    const debouncedServiceSearch = useDebounce(serviceSearch, GENERAL_DEBOUNCE_DELAY);

    const debouncedWorkerSearch = useDebounce(workerSearch, GENERAL_DEBOUNCE_DELAY);

    /*
     * The worker from the calendar is only the initial
     * worker preference.
     *
     * AppointmentAvailability uses it to initially expand
     * that worker's group.
     */
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedAppointmentWorkerUuid(initialSelectedWorkerUuid);
    }, [initialSelectedWorkerUuid]);

    const { data: customersData, isPending: customersLoading } = useOrganizationCustomers(
        organizationUuid,
        {
            page: 1,
            limit: 100,
            search: debouncedCustomerSearch || undefined,
        },
    );

    const { data: servicesData, isLoading: servicesLoading } = useOrganizationServices(
        organizationUuid,
        {
            page: 1,
            limit: PAGE_SIZE,

            search: debouncedServiceSearch || undefined,

            filter: {
                organizationUuid,

                status: ActivationStatus.ACTIVE,
            },
        },
    );

    const { data: workersData, isPending: workersLoading } = useOrganizationWorkers(organizationUuid);

    const customerOptions = useMemo(
        () =>
            (customersData?.data ?? []).map((user) => ({
                value: user.uuid,

                label: `${user.firstName} ${user.lastName} — ${user.email}`,
            })),
        [customersData],
    );

    const serviceOptions = useMemo(
        () =>
            (servicesData?.data ?? []).map((service) => ({
                value: service.uuid,

                label: `${service.name} — ${service.durationInMinutes} min`,
            })),
        [servicesData],
    );

    const workerOptions = useMemo(() => {
        const search = debouncedWorkerSearch.trim().toLowerCase();

        return (workersData ?? [])
            .filter((user) =>
                search
                    ? `${user.firstName} ${user.lastName}`.toLowerCase().includes(search)
                    : true,
            )
            .map((user) => ({
                value: user.uuid,

                label: `${user.firstName} ${user.lastName}`,
            }));
    }, [workersData, debouncedWorkerSearch]);

    const defaultStart = useMemo(
        () => getDefaultStart(selectedDate, selectedTime, organizationTimeZone),
        [selectedDate, selectedTime, organizationTimeZone],
    );

    const defaultValues = useMemo<CreateAppointmentFormInput>(
        () => ({
            organizationTitle: '',

            userUuid: '',

            serviceUuid: '',

            timeType: AppointmentTimeType.NEAREST,

            /*
             * This value is used when switching to
             * WORKER mode.
             *
             * NEAREST mode does not use it for
             * scheduling or worker selection.
             */
            workerUuid: initialSelectedWorkerUuid ?? '',

            roomUuid: '',

            fromAtUTC: defaultStart,

            scheduledStartAtUTC: '',

            organizationNote: '',

            organizationColour: '#2563EB',

            paymentMethod: PaymentMethod.CASH,
        }),
        [defaultStart, initialSelectedWorkerUuid],
    );

    const fields = useMemo<
        readonly CreateDialogField<CreateAppointmentFormInput, CreateAppointmentFormOutput>[]
    >(
        () => [
            {
                name: 'organizationTitle',

                label: 'Appointment Title',

                type: 'text',

                placeholder: 'Enter appointment title',
            },

            {
                name: 'timeType',

                label: 'Appointment Availability',

                type: 'select',

                options: [
                    {
                        value: AppointmentTimeType.NEAREST,

                        label: appointmentTimeTypeRecord[AppointmentTimeType.NEAREST],
                    },

                    {
                        value: AppointmentTimeType.WORKER,

                        label: appointmentTimeTypeRecord[AppointmentTimeType.WORKER],
                    },
                ],

                placeholder: 'Select availability',
            },

            {
                name: 'userUuid',

                label: 'Customer',

                type: 'searchable-select',

                options: customerOptions,

                placeholder: customersLoading ? 'Loading customers...' : 'Select a customer',

                searchPlaceholder: 'Search customers...',

                onSearchChange: setCustomerSearch,
            },

            {
                name: 'serviceUuid',

                label: 'Service',

                type: 'searchable-select',

                options: serviceOptions,

                placeholder: servicesLoading ? 'Loading services...' : 'Select a service',

                searchPlaceholder: 'Search services...',

                onSearchChange: setServiceSearch,
            },

            {
                name: 'fromAtUTC',

                label: 'Find Availability From',

                type: 'datetime-local',

                visible: (form) => form.watch('timeType') === AppointmentTimeType.NEAREST,

                description:
                    'Choose the organization-local date and time from which available appointments should be found.',
            },

            {
                name: 'workerUuid',

                label: 'Worker',

                type: 'searchable-select',

                options: workerOptions,

                visible: (form) => form.watch('timeType') === AppointmentTimeType.WORKER,

                placeholder: workersLoading ? 'Loading workers...' : 'Select a worker',

                searchPlaceholder: 'Search workers...',

                onSearchChange: setWorkerSearch,
            },

            {
                name: 'scheduledStartAtUTC',

                label: 'Available Appointment Times',

                type: 'custom',

                visible: (form) => {
                    const userUuid = form.watch('userUuid');

                    const serviceUuid = form.watch('serviceUuid');

                    const timeType = form.watch('timeType');

                    return Boolean(userUuid && serviceUuid && timeType);
                },

                render: (form) => (
                    <AppointmentAvailability
                        organizationUuid={organizationUuid}
                        organizationTimeZone={organizationTimeZone}
                        form={form}
                        initialWorkerUuid={initialSelectedWorkerUuid}
                        onAppointmentWorkerChange={setSelectedAppointmentWorkerUuid}
                    />
                ),
            },

            {
                name: 'organizationNote',

                label: 'Organization Note',

                type: 'text',

                placeholder: 'Optional note',
            },

            {
                name: 'organizationColour',

                label: 'Appointment Colour',

                type: 'color',
            },

            {
                name: 'paymentMethod',

                label: 'Payment Method',

                type: 'select',

                options: Object.values(PaymentMethod).map((method) => ({
                    value: method,

                    label: paymentMethodRecord[method],
                })),

                placeholder: 'Select payment method',
            },
        ],
        [
            customerOptions,
            serviceOptions,
            workerOptions,
            customersLoading,
            servicesLoading,
            workersLoading,
            organizationUuid,
            organizationTimeZone,
            initialSelectedWorkerUuid,
        ],
    );

    async function handleSubmit(values: CreateAppointmentFormOutput) {
        const {
            organizationTitle,
            userUuid,
            serviceUuid,
            timeType,
            workerUuid,
            scheduledStartAtUTC,
            organizationNote,
            organizationColour,
            paymentMethod,
        } = values;

        /*
         * WORKER mode:
         *     workerUuid comes from the form.
         *
         * NEAREST mode:
         *     worker comes from the availability option
         *     selected by the user.
         */
        const appointmentWorkerUuid =
            timeType === AppointmentTimeType.WORKER ? workerUuid : selectedAppointmentWorkerUuid;

        if (!appointmentWorkerUuid) {
            toast.error('Please select an available appointment time.');

            return;
        }

        const appointment = {
            organizationTitle,

            userUuid,

            serviceUuid,

            workerUuid: appointmentWorkerUuid,

            scheduledStartAtUTC,

            organizationNote: organizationNote || undefined,

            organizationColour: organizationColour || undefined,

            paymentMethod,
        };

        const result = createOrganizationAppointmentSchema.safeParse(appointment);

        if (!result.success) {
            toast.error(
                result.error.issues[0]?.message ?? 'Please check the appointment details.',
            );

            return;
        }

        try {
            await toast.promise(createMutation.mutateAsync(result.data), {
                loading: 'Creating appointment...',

                success: 'Appointment created successfully',

                error: (mutationError) =>
                    getApiErrorMessage(mutationError, 'Failed to create appointment'),
            });

            onOpenChange(false);
        } catch {
            // toast.promise already surfaced the error.
        }
    }

    const appointmentDateKey = useMemo(
        () => [selectedDate?.getTime() ?? 'none', selectedTime?.getTime() ?? 'none'].join('-'),
        [selectedDate, selectedTime],
    );

    return (
        <CreateDialog<CreateAppointmentFormInput, CreateAppointmentFormOutput>
            key={`${open}-${appointmentDateKey}-${initialSelectedWorkerUuid ?? 'none'}`}
            open={open}
            onOpenChange={onOpenChange}
            title="Create Appointment"
            description="Choose how you want to find an appointment, then select an available time."
            resolver={zodResolver(createAppointmentFormSchema)}
            defaultValues={defaultValues}
            fields={fields}
            topContent={<OrganizationTimeInfo timeZone={organizationTimeZone} />}
            submitLabel="Create Appointment"
            errorMessage={
                createMutation.isError && !getApiFieldErrors(createMutation.error)
                    ? getApiErrorMessage(createMutation.error, 'Failed to create appointment')
                    : undefined
            }
            fieldErrors={getApiFieldErrors(createMutation.error)}
            onSubmit={handleSubmit}
        />
    );
}
