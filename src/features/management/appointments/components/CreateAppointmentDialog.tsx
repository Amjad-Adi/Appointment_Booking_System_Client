import { useMemo, useState } from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

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
import { OrganizationTimeInfo } from './OrganizationTimeInfo.tsx';

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
     * This is deliberately separate from form.workerUuid.
     *
     * In NEAREST mode the scheduling request must not contain workerUuid,
     * but the worker from the selected availability option is still
     * required when creating the actual appointment.
     */
    const [selectedAppointmentWorkerUuid, setSelectedAppointmentWorkerUuid] = useState<
        string | undefined
    >(initialSelectedWorkerUuid);

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

    const defaultStart = useMemo(
        () => getDefaultStart(selectedDate, selectedTime, organizationTimeZone),
        [selectedDate, selectedTime, organizationTimeZone],
    );

    const defaultValues = useMemo<CreateAppointmentFormInput>(() => {
        const initialTimeType = initialSelectedWorkerUuid
            ? AppointmentTimeType.WORKER
            : AppointmentTimeType.NEAREST;

        return {
            name: '',
            userUuid: '',
            serviceUuid: '',

            timeType: initialTimeType,

            /*
             * This is only populated for WORKER mode.
             *
             * NEAREST mode keeps this empty because workerUuid is
             * forbidden in the scheduling request.
             */
            workerUuid:
                initialTimeType === AppointmentTimeType.WORKER
                    ? (initialSelectedWorkerUuid ?? '')
                    : '',

            roomUuid: '',

            fromAtUTC: initialTimeType === AppointmentTimeType.NEAREST ? defaultStart : '',

            scheduledStartAtUTC: '',

            organizationNote: '',
            organizationColour: '#2563EB',

            paymentMethod: PaymentMethod.CASH,
        };
    }, [defaultStart, initialSelectedWorkerUuid]);

    const fields = useMemo<
        readonly CreateDialogField<CreateAppointmentFormInput, CreateAppointmentFormOutput>[]
    >(
        () => [
            {
                name: 'name',
                label: 'Appointment Name',
                type: 'text',
                placeholder: 'Enter appointment name',
            },

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
            organizationTimeZone,
            initialSelectedWorkerUuid,
        ],
    );

    async function handleSubmit(values: CreateAppointmentFormOutput) {
        if (!values.scheduledStartAtUTC) {
            toast.error('Please select an available appointment time.');
            return;
        }

        const appointmentWorkerUuid =
            values.timeType === AppointmentTimeType.WORKER
                ? values.workerUuid
                : selectedAppointmentWorkerUuid;

        if (!appointmentWorkerUuid) {
            toast.error('Please select an available appointment time.');
            return;
        }

        /*
         * timeType is a scheduling-only field.
         *
         * fromAtUTC is a scheduling-only field.
         *
         * roomUuid is also not sent here because the current appointment
         * creation schema/API does not accept it.
         *
         * The selected availability already determines the worker and
         * scheduled start time for the appointment.
         */
        const appointment = {
            name: values.name,
            userUuid: values.userUuid,
            serviceUuid: values.serviceUuid,
            workerUuid: appointmentWorkerUuid,
            scheduledStartAtUTC: values.scheduledStartAtUTC,
            organizationNote: values.organizationNote || undefined,
            organizationColour: values.organizationColour || undefined,
            paymentMethod: values.paymentMethod,
        };

        const result = createOrganizationAppointmentSchema.safeParse(appointment);

        if (!result.success) {
            console.error('Create appointment validation failed:', result.error.flatten());

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
            topContent={<OrganizationTimeInfo timeZone={organizationTimeZone} />}
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
