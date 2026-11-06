import { useState } from 'react';
import { Link } from 'react-router';
import { type PaginationState } from '@tanstack/react-table';

import { ManagementPage } from '../../../components/ManagementPage.tsx';
import { ErrorState } from '../../../../../components/ErrorState.tsx';
import { PAGE_SIZE } from '../../../../../components/DataTableFeatures.ts';
import { Select } from '../../../../../components/Select.tsx';

import { useAppointments } from '../../../hooks/appointment-hook.ts';

import { AppointmentStatus } from '../../../../../models/enums/appointment-status.ts';
import { appointmentStatusRecord } from '../../../../../models/enums-mapping/appointment-status.ts';

import { CustomerAppointmentList } from './components/CustomerAppointmentList.tsx';

export function CustomerAppointmentsPage() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<AppointmentStatus | undefined>();

    const { data, isLoading, isError, error, refetch } = useAppointments({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: search || undefined,
        filter: status ? { appointmentStatus: status } : undefined,
    });

    const resetPage = () => {
        setPagination((previous) => ({ ...previous, pageIndex: 0 }));
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        resetPage();
    };

    const filters = (
        <Select
            label="Status"
            isLabelDisabled
            value={status ?? ''}
            onChange={(event) => {
                const value = event.target.value;
                setStatus(value === '' ? undefined : (value as AppointmentStatus));
                resetPage();
            }}
            wrapperClassName="w-44 max-sm:w-[48%] max-[350px]:w-full"
            className="!h-8 px-2 text-[11px]"
        >
            <option value="">All statuses</option>

            {Object.values(AppointmentStatus).map((value) => (
                <option key={value} value={value}>
                    {appointmentStatusRecord[value]}
                </option>
            ))}
        </Select>
    );

    const actions = (
        <Link
            to="/customer/services"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
            Book Appointment
        </Link>
    );

    if (isError) {
        return (
            <ManagementPage
                title="My Appointments"
                description={['View and manage appointments you booked with organizations.']}
            >
                <ErrorState
                    error={error}
                    title="Failed to load appointments"
                    onRetry={() => refetch()}
                />
            </ManagementPage>
        );
    }

    return (
        <ManagementPage
            title="My Appointments"
            description={['View and manage appointments you booked with organizations.']}
        >
            <CustomerAppointmentList
                appointments={data?.data ?? []}
                search={search}
                onSearchChange={handleSearchChange}
                filters={filters}
                actions={actions}
                pagination={pagination}
                onPaginationChange={setPagination}
                rowCount={data?.pagination?.totalItems ?? 0}
                rowCountLabel={`${data?.pagination?.totalItems === 0 ? 'No' : (data?.pagination?.totalItems ?? 0)} Appointments`}
                isLoading={isLoading}
            />
        </ManagementPage>
    );
}
