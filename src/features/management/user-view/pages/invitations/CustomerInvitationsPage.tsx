import { useState } from 'react';
import { type PaginationState } from '@tanstack/react-table';
import toast from 'react-hot-toast';

import { ManagementPage } from '../../../components/ManagementPage.tsx';
import { BoardView } from '../../../../../components/BoardView.tsx';
import { ErrorState } from '../../../../../components/ErrorState.tsx';
import { PAGE_SIZE } from '../../../../../components/DataTableFeatures.ts';
import { Select } from '../../../../../components/Select.tsx';

import {
    useMyCustomerInvitations,
    useRespondToCustomerInvitation,
} from '../../../hooks/customer-invitation-hook.ts';

import { CustomerInvitationStatus } from '../../../../../models/enums/customer-invitation-status.ts';
import { customerInvitationStatusRecord } from '../../../../../models/enums-mapping/customer-invitation-status.ts';
import type { CustomerInvitationResponse } from '../../../../../models/customer-invitation.model.ts';

import { getApiErrorMessage } from '../../../../../utlis/api-error.ts';

import { InvitationCard } from './components/InvitationCard.tsx';

export function CustomerInvitationsPage() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<CustomerInvitationStatus | undefined>();

    const respondMutation = useRespondToCustomerInvitation();

    const { data, isLoading, isError, error, refetch } = useMyCustomerInvitations({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: search || undefined,
        filter: status ? { status } : undefined,
    });

    const resetPage = () => {
        setPagination((previous) => ({ ...previous, pageIndex: 0 }));
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        resetPage();
    };

    const respond = async (
        invitation: CustomerInvitationResponse,
        nextStatus: CustomerInvitationStatus,
    ) => {
        try {
            await toast.promise(
                respondMutation.mutateAsync({
                    invitationUuid: invitation.uuid,
                    status: nextStatus,
                }),
                {
                    loading:
                        nextStatus === CustomerInvitationStatus.ACCEPTED
                            ? 'Accepting invitation...'
                            : 'Rejecting invitation...',
                    success:
                        nextStatus === CustomerInvitationStatus.ACCEPTED
                            ? 'Invitation accepted'
                            : 'Invitation rejected',
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to respond to invitation'),
                },
            );
        } catch {
            // Error is surfaced by toast.promise.
        }
    };

    const filters = (
        <Select
            label="Status"
            isLabelDisabled
            value={status ?? ''}
            onChange={(event) => {
                const value = event.target.value;
                setStatus(value === '' ? undefined : (value as CustomerInvitationStatus));
                resetPage();
            }}
            wrapperClassName="w-44 max-sm:w-[48%] max-[350px]:w-full"
            className="!h-8 px-2 text-[11px]"
        >
            <option value="">All statuses</option>

            {Object.values(CustomerInvitationStatus).map((value) => (
                <option key={value} value={value}>
                    {customerInvitationStatusRecord[value]}
                </option>
            ))}
        </Select>
    );

    if (isError) {
        return (
            <ManagementPage
                title="Invitations"
                description={['Organization invitations sent to your account.']}
            >
                <ErrorState
                    error={error}
                    title="Failed to load invitations"
                    onRetry={() => refetch()}
                />
            </ManagementPage>
        );
    }

    return (
        <ManagementPage
            title="Invitations"
            description={['Organization invitations sent to your account.']}
        >
            <BoardView<CustomerInvitationResponse>
                items={data?.data ?? []}
                getKey={(invitation) => invitation.uuid}
                renderItem={(invitation) => (
                    <InvitationCard
                        invitation={invitation}
                        onRespond={respond}
                        isResponding={respondMutation.isPending}
                    />
                )}
                search={search}
                onSearchChange={handleSearchChange}
                filters={filters}
                pagination={pagination}
                onPaginationChange={setPagination}
                rowCount={data?.pagination?.totalItems ?? 0}
                rowCountLabel={`${data?.pagination?.totalItems === 0 ? 'No' : (data?.pagination?.totalItems ?? 0)} Invitations`}
                isLoading={isLoading}
                emptyTitle="No invitations"
                emptyDescription="Organization invitations will appear here."
                gridClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
            />
        </ManagementPage>
    );
}
