import { useMemo, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { CreateDialog, type CreateDialogField } from '../../../../components/CreateDialog.tsx';

import { useCreateOrganizationAppointment } from '../../hooks/appointment-hook.ts';
import { useUsers } from '../../hooks/users-hook.ts';
import { useServices } from '../../hooks/services-hook.ts';
import { useRooms } from '../../hooks/room-hook.ts';

import { createOrganizationAppointmentSchema } from '../../../../zod-schemas/appointment.schema.ts';

import { Role } from '../../../../models/enums/roles.ts';
import { ActivationStatus } from '../../../../models/enums/activation-status.ts';
import { PaymentMethod } from '../../../../models/enums/payment-method.ts';

import { PAGE_SIZE } from '../../../../components/DataTableFeatures.ts';

import { GENERAL_DEBOUNCE_DELAY, useDebounce } from '../../../../hooks/deounce.ts';

interface CreateAppointmentDialogProps {
    organizationUuid?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedDate?: Date;
    selectedTime?: Date;
    selectedWorkerUuid?: string;
}

type CreateAppointmentForm = z.input<typeof createOrganizationAppointmentSchema>;

type CreateAppointmentFormOutput = z.output<typeof createOrganizationAppointmentSchema>;

function toDateTimeLocal(value?: Date) {
    if (!value) {
        return '';
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
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
    const [roomSearch, setRoomSearch] = useState('');

    const debouncedCustomerSearch = useDebounce(customerSearch, GENERAL_DEBOUNCE_DELAY);

    const debouncedServiceSearch = useDebounce(serviceSearch, GENERAL_DEBOUNCE_DELAY);

    const debouncedWorkerSearch = useDebounce(workerSearch, GENERAL_DEBOUNCE_DELAY);

    const debouncedRoomSearch = useDebounce(roomSearch, GENERAL_DEBOUNCE_DELAY);

    const { data: customersData, isLoading: customersLoading } = useUsers({
        page: 1,
        limit: PAGE_SIZE,
        search: debouncedCustomerSearch || undefined,
        filter: {
            role: Role.CUSTOMER,
            status: ActivationStatus.ACTIVE,
            organizationUuid,
        },
    });

    const { data: servicesData, isLoading: servicesLoading } = useServices({
        page: 1,
        limit: PAGE_SIZE,
        search: debouncedServiceSearch || undefined,
        filter: {
            organizationUuid,
            status: ActivationStatus.ACTIVE,
        },
    });

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

    const { data: roomsData, isLoading: roomsLoading } = useRooms({
        page: 1,
        limit: PAGE_SIZE,
        search: debouncedRoomSearch || undefined,
        filter: {
            organizationUuid,
            status: ActivationStatus.ACTIVE,
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
        () =>
            (workersData?.data ?? []).map((user) => ({
                value: user.uuid,
                label: `${user.firstName} ${user.lastName}`,
            })),
        [workersData],
    );

    const roomOptions = useMemo(
        () =>
            (roomsData?.data ?? [])
                .filter((room) => room.occupancyStatus !== 'OCCUPIED')
                .map((room) => ({
                    value: room.uuid,
                    label: room.name,
                })),
        [roomsData],
    );

    const defaultValues = useMemo<CreateAppointmentForm>(
        () => ({
            userUuid: '',
            serviceUuid: '',
            workerUuid: selectedWorkerUuid ?? '',
            roomUuid: '',
            scheduledStartAtUTC: toDateTimeLocal(selectedTime ?? selectedDate),
            organizationNote: '',
            organizationColour: '#2563EB',
            paymentMethod: null,
        }),
        [selectedDate, selectedTime, selectedWorkerUuid],
    );

    const fields = useMemo<readonly CreateDialogField<CreateAppointmentForm>[]>(
        () => [
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
                name: 'workerUuid',
                label: 'Worker',
                type: 'searchable-select',
                options: workerOptions,
                placeholder: workersLoading ? 'Loading workers...' : 'Select a worker',
                searchPlaceholder: 'Search workers...',
                onSearchChange: setWorkerSearch,
            },
            {
                name: 'roomUuid',
                label: 'Room',
                type: 'searchable-select',
                options: roomOptions,
                placeholder: roomsLoading ? 'Loading rooms...' : 'Select a room',
                searchPlaceholder: 'Search rooms...',
                onSearchChange: setRoomSearch,
            },
            {
                name: 'scheduledStartAtUTC',
                label: 'Start Time',
                type: 'datetime-local',
            },
            {
                name: 'organizationNote',
                label: 'Organization Note',
                type: 'text',
            },
            {
                name: 'paymentMethod',
                label: 'Payment Method',
                type: 'select',
                options: Object.values(PaymentMethod).map((method) => ({
                    value: method,
                    label: method,
                })),
                placeholder: 'No payment method',
            },
        ],
        [
            customerOptions,
            serviceOptions,
            workerOptions,
            roomOptions,
            customersLoading,
            servicesLoading,
            workersLoading,
            roomsLoading,
        ],
    );

    async function handleSubmit(values: CreateAppointmentFormOutput) {
        await toast.promise(createMutation.mutateAsync(values), {
            loading: 'Creating appointment...',
            success: 'Appointment created successfully',
            error: 'Failed to create appointment',
        });

        onOpenChange(false);
    }

    return (
        <CreateDialog<CreateAppointmentForm, CreateAppointmentFormOutput>
            open={open}
            onOpenChange={onOpenChange}
            title="Create Appointment"
            description="Create a new appointment for this organization."
            resolver={zodResolver(createOrganizationAppointmentSchema)}
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
