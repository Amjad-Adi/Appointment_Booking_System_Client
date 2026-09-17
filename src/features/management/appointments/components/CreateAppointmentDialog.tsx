import { useMemo, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { CreateDialog, type CreateDialogField } from '../../../../components/CreateDialog.tsx';

import { useCreateOrganizationAppointment } from '../../hooks/appointment-hook.ts';
import { useUsers } from '../../hooks/users-hook.ts';
import { useOrganizationServices } from '../../hooks/services-hook.ts';

import {
    createAppointmentFormSchema,
    createOrganizationAppointmentSchema,
    type CreateAppointmentFormInput,
    type CreateAppointmentFormOutput,
} from '../../../../zod-schemas/appointment.schema.ts';

import { Role } from '../../../../models/enums/roles.ts';
import { ActivationStatus } from '../../../../models/enums/activation-status.ts';
import { PaymentMethod } from '../../../../models/enums/payment-method.ts';
import { AppointmentTimeType } from '../../../../models/enums/appointment-time-type.ts';

import { PAGE_SIZE } from '../../../../components/DataTableFeatures.ts';
import { GENERAL_DEBOUNCE_DELAY, useDebounce } from '../../../../hooks/deounce.ts';

import { AppointmentAvailability } from './AppointmentAvailability.tsx';

import toast from 'react-hot-toast';

interface CreateAppointmentDialogProps {
    organizationUuid?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedDate?: Date;
    selectedTime?: Date;
    selectedWorkerUuid?: string;
}

function getDefaultStart(selectedDate?: Date, selectedTime?: Date): string {
    return (selectedTime ?? selectedDate ?? new Date()).toISOString();
}

export function CreateAppointmentDialog({
    organizationUuid,
    open,
    onOpenChange,
    selectedDate,
    selectedTime,
    selectedWorkerUuid,
}: CreateAppointmentDialogProps) {
    const createMutation = useCreateOrganizationAppointment(organizationUuid);

    const [customerSearch, setCustomerSearch] = useState('');
    const [serviceSearch, setServiceSearch] = useState('');
    const [workerSearch, setWorkerSearch] = useState('');

    const debouncedCustomerSearch = useDebounce(customerSearch, GENERAL_DEBOUNCE_DELAY);

    const debouncedServiceSearch = useDebounce(serviceSearch, GENERAL_DEBOUNCE_DELAY);

    const debouncedWorkerSearch = useDebounce(workerSearch, GENERAL_DEBOUNCE_DELAY);

    const { data: customersData, isLoading: customersLoading } = useUsers({
        page: 1,
        limit: PAGE_SIZE,
        search: debouncedCustomerSearch || undefined,
        filter: {
            role: Role.CUSTOMER,
            status: ActivationStatus.ACTIVE,
        },
    });

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

    const { data: workersData, isLoading: workersLoading } = useUsers({
        page: 1,
        limit: PAGE_SIZE,
        search: debouncedWorkerSearch || undefined,
        filter: {
            role: Role.WORKER,
            status: ActivationStatus.ACTIVE,
            organizationUuid,
        },
    });

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

    const workerOptions = useMemo(
        () => [
            {
                value: '',
                label: 'Unselected',
            },
            ...(workersData?.data ?? []).map((user) => ({
                value: user.uuid,
                label: `${user.firstName} ${user.lastName}`,
            })),
        ],
        [workersData],
    );

    /*
     * Important:
     * Keep this stable between renders.
     *
     * The previous implementation calculated new Date().toISOString()
     * during every render, which could cause defaultValues to change
     * continuously and reset the form.
     */
    const defaultStart = useMemo(
        () => getDefaultStart(selectedDate, selectedTime),
        [selectedDate, selectedTime],
    );

    const defaultValues = useMemo<CreateAppointmentFormInput>(
        () => ({
            name: '',
            userUuid: '',
            serviceUuid: '',

            timeType: selectedWorkerUuid ? AppointmentTimeType.WORKER : AppointmentTimeType.NEAREST,

            workerUuid: selectedWorkerUuid ?? '',

            fromAtUTC: defaultStart,
            scheduledStartAtUTC: defaultStart,

            organizationNote: '',
            organizationColour: '#2563EB',
            paymentMethod: PaymentMethod.CASH,
        }),
        [defaultStart, selectedWorkerUuid],
    );

    const fields = useMemo<readonly CreateDialogField<CreateAppointmentFormInput>[]>(
        () => [
            /*
             * 1. AVAILABILITY FIRST
             */
            {
                name: 'timeType',
                label: 'Appointment Availability',
                type: 'select',
                options: [
                    {
                        value: AppointmentTimeType.NEAREST,
                        label: 'Nearest available',
                    },
                    {
                        value: AppointmentTimeType.WORKER,
                        label: 'Specific worker',
                    },
                ],
                placeholder: 'Select availability',
            },

            /*
             * 2. CUSTOMER
             */
            {
                name: 'userUuid',
                label: 'Customer',
                type: 'searchable-select',
                options: customerOptions,
                placeholder: customersLoading ? 'Loading customers...' : 'Select a customer',
                searchPlaceholder: 'Search customers...',
                onSearchChange: setCustomerSearch,
            },

            /*
             * 3. SERVICE
             */
            {
                name: 'serviceUuid',
                label: 'Service',
                type: 'searchable-select',
                options: serviceOptions,
                placeholder: servicesLoading ? 'Loading services...' : 'Select a service',
                searchPlaceholder: 'Search services...',
                onSearchChange: setServiceSearch,
            },

            /*
             * 4A. NEAREST AVAILABLE
             *
             * Only visible when nearest availability is selected.
             */
            {
                name: 'fromAtUTC',
                label: 'Find Availability From',
                type: 'datetime-local',
                visible: (form) => form.watch('timeType') === AppointmentTimeType.NEAREST,
                description:
                    'Choose the date and time from which available appointments should be found.',
            },

            /*
             * 4B. SPECIFIC WORKER
             *
             * Completely removed from the UI when nearest availability
             * is selected.
             */
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

            /*
             * 5. AVAILABLE TIMES
             *
             * One result presentation only.
             */
            {
                name: 'scheduledStartAtUTC',
                label: 'Available Appointment Times',
                type: 'custom',
                render: (form) => (
                    <AppointmentAvailability
                        organizationUuid={organizationUuid}
                        form={form}
                    />
                ),
            },

            /*
             * 6. NOTE
             */
            {
                name: 'organizationNote',
                label: 'Organization Note',
                type: 'text',
                placeholder: 'Optional note',
            },

            /*
             * 7. PAYMENT
             */
            {
                name: 'paymentMethod',
                label: 'Payment Method',
                type: 'select',
                options: Object.values(PaymentMethod).map((method) => ({
                    value: method,
                    label: method,
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
            selectedDate,
            selectedTime,
            selectedWorkerUuid,
        ],
    );

    async function handleSubmit(values: CreateAppointmentFormOutput) {
        if (!values.scheduledStartAtUTC) {
            toast.error('Please select an available appointment time.');
            return;
        }

        if (values.timeType === AppointmentTimeType.WORKER && !values.workerUuid) {
            toast.error('Please select a worker.');
            return;
        }

        const appointment = {
            name: values.name,
            userUuid: values.userUuid,
            serviceUuid: values.serviceUuid,
            workerUuid: values.workerUuid,
            scheduledStartAtUTC: values.scheduledStartAtUTC,
            organizationNote: values.organizationNote,
            organizationColour: values.organizationColour,
            paymentMethod: values.paymentMethod,
        };

        const result = createOrganizationAppointmentSchema.safeParse(appointment);

        if (!result.success) {
            toast.error('Please check the appointment details.');
            return;
        }

        await toast.promise(createMutation.mutateAsync(result.data), {
            loading: 'Creating appointment...',
            success: 'Appointment created successfully',
            error: 'Failed to create appointment',
        });

        onOpenChange(false);
    }

    return (
        <CreateDialog<CreateAppointmentFormInput, CreateAppointmentFormOutput>
            open={open}
            onOpenChange={onOpenChange}
            title="Create Appointment"
            description="Choose how you want to find an appointment, then select an available time."
            resolver={zodResolver(createAppointmentFormSchema)}
            defaultValues={defaultValues}
            fields={fields}
            submitLabel="Create Appointment"
            errorMessage={
                createMutation.isError
                    ? 'Failed to create appointment. Please try again.'
                    : undefined
            }
            onSubmit={handleSubmit}
        />
    );
}
