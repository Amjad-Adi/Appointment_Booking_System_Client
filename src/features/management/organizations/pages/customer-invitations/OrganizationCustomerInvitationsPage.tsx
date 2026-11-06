import { useState } from 'react';
import { type PaginationState, type SortingState } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { ManagementPage } from '../../../components/ManagementPage.tsx';
import { DataTable } from '../../../../../components/DataTable.tsx';
import { ErrorState } from '../../../../../components/ErrorState.tsx';
import { PAGE_SIZE, type DataTableColumn } from '../../../../../components/DataTableFeatures.ts';
import { Button } from '../../../../../components/Button.tsx';
import { Select } from '../../../../../components/Select.tsx';
import {
    CreateDialog,
    type CreateDialogField,
} from '../../../../../components/CreateDialog.tsx';

import {
    useCancelCustomerInvitation,
    useCreateCustomerInvitation,
    useOrganizationCustomerInvitations,
} from '../../../hooks/customer-invitation-hook.ts';
import { useCurrentUser } from '../../../hooks/users-hook.ts';

import { CustomerInvitationStatus } from '../../../../../models/enums/customer-invitation-status.ts';
import { customerInvitationStatusRecord } from '../../../../../models/enums-mapping/customer-invitation-status.ts';
import { Order } from '../../../../../models/enums/order.ts';
import { Role } from '../../../../../models/enums/roles.ts';
import type { CustomerInvitationResponse } from '../../../../../models/customer-invitation.model.ts';

import { getApiErrorMessage } from '../../../../../utlis/api-error.ts';

const createInvitationSchema = z.object({
    recipientEmail: z.email({ error: 'Invalid email address' }),
});

type CreateInvitationForm = z.infer<typeof createInvitationSchema>;

const statusClasses: Record<string, string> = {
    [CustomerInvitationStatus.PENDING]: 'border-warning-border bg-warning-soft text-warning',
    [CustomerInvitationStatus.ACCEPTED]: 'border-success-border bg-success-soft text-success',
    [CustomerInvitationStatus.REJECTED]: 'border-destructive-border bg-destructive-soft text-destructive',
    [CustomerInvitationStatus.CANCELLED]: 'border-border bg-muted text-muted-foreground',
    [CustomerInvitationStatus.EXPIRED]: 'border-border bg-muted text-muted-foreground',
};

export function OrganizationCustomerInvitationsPage() {
    const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
    const organizationUuid = currentUser?.organizationUuid;
    const canManage =
        currentUser?.role === Role.OWNER || currentUser?.role === Role.MANAGER;

    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<CustomerInvitationStatus | undefined>();
    const [createOpen, setCreateOpen] = useState(false);

    const createMutation = useCreateCustomerInvitation(organizationUuid);
    const cancelMutation = useCancelCustomerInvitation(organizationUuid);

    const sort = sorting[0];
    const sortBy: 'createdAtUTC' | 'expiresAtUTC' | 'updatedAtUTC' | undefined = sort
        ? sort.id === 'expiresAtUTC'
            ? 'expiresAtUTC'
            : sort.id === 'updatedAtUTC'
              ? 'updatedAtUTC'
              : 'createdAtUTC'
        : undefined;

    const { data, isLoading, isError, error, refetch } = useOrganizationCustomerInvitations(
        organizationUuid,
        {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            sortBy,
            order: sort ? (sort.desc ? Order.DESC : Order.ASC) : undefined,
            search: search || undefined,
            filter: status ? { status } : undefined,
        },
        !isUserLoading,
    );

    const handleCancel = async (invitation: CustomerInvitationResponse) => {
        if (!window.confirm('Cancel this invitation?')) {
            return;
        }

        try {
            await toast.promise(cancelMutation.mutateAsync(invitation.uuid), {
                loading: 'Cancelling invitation...',
                success: 'Invitation cancelled',
                error: (mutationError) =>
                    getApiErrorMessage(mutationError, 'Failed to cancel invitation'),
            });
        } catch {
            // Error is surfaced by toast.promise.
        }
    };

    const columns: DataTableColumn<CustomerInvitationResponse>[] = [
        {
            accessorKey: 'recipientEmail',
            header: 'Recipient',
            cell: ({ row }) => (
                <span className="block max-w-64 truncate font-medium text-foreground">
                    {row.original.recipientEmail}
                </span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            enableSorting: false,
            cell: ({ row }) => (
                <span
                    className={[
                        'inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold',
                        statusClasses[row.original.status] ??
                            'border-border bg-secondary text-secondary-foreground',
                    ].join(' ')}
                >
                    {customerInvitationStatusRecord[row.original.status]}
                </span>
            ),
        },
        {
            id: 'sender',
            header: 'Sent By',
            enableSorting: false,
            cell: ({ row }) => (
                <span className="block max-w-48 truncate">
                    {row.original.senderFirstName} {row.original.senderLastName}
                </span>
            ),
        },
        {
            id: 'createdAtUTC',
            accessorKey: 'createdAtUTC',
            header: 'Sent',
            cell: ({ row }) => new Date(row.original.createdAtUTC).toLocaleDateString(),
        },
        {
            id: 'expiresAtUTC',
            accessorKey: 'expiresAtUTC',
            header: 'Expires',
            cell: ({ row }) => new Date(row.original.expiresAtUTC).toLocaleDateString(),
        },
        {
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex justify-end">
                    {canManage ? (
                        <Button
                            type="button"
                            disabled={
                                row.original.status !== CustomerInvitationStatus.PENDING ||
                                cancelMutation.isPending
                            }
                            onClick={() => handleCancel(row.original)}
                            className="inline-flex h-7 items-center justify-center rounded-lg border border-destructive-border bg-transparent px-2.5 text-[10px] font-semibold text-destructive transition-colors hover:bg-destructive-soft disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Cancel
                        </Button>
                    ) : (
                        <span className="text-[10px] text-muted-foreground">—</span>
                    )}
                </div>
            ),
        },
    ];

    const fields: CreateDialogField<CreateInvitationForm>[] = [
        {
            name: 'recipientEmail',
            label: 'Customer Email',
            type: 'email',
            placeholder: 'customer@example.com',
            description:
                'The customer must already have an account. They will receive the invitation in their Invitations page.',
        },
    ];

    const filters = (
        <Select
            label="Status"
            isLabelDisabled
            value={status ?? ''}
            onChange={(event) => {
                const value = event.target.value;
                setStatus(
                    value === '' ? undefined : (value as CustomerInvitationStatus),
                );
                setPagination((previous) => ({ ...previous, pageIndex: 0 }));
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

    const actions = (
        <Button
            type="button"
            onClick={() => setCreateOpen(true)}
            disabled={!organizationUuid}
            className="flex h-8 min-h-0 w-auto shrink-0 items-center gap-1.5 px-3 text-[11px]"
        >
            <Plus className="size-3.5" strokeWidth={2} />
            Invite Customer
        </Button>
    );

    if (!isUserLoading && !organizationUuid) {
        return (
            <ManagementPage title="Customer Invitations">
                <ErrorState
                    title="No organization linked"
                    message="Your account is not linked to an organization yet."
                />
            </ManagementPage>
        );
    }

    if (isError) {
        return (
            <ManagementPage title="Customer Invitations">
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
            title="Customer Invitations"
            description={[
                'Invite customers to link with your organization so they appear in your customer list.',
            ]}
        >
            <DataTable
                tableKey="organization-customer-invitations-table"
                data={data?.data ?? []}
                columns={columns}
                sorting={sorting}
                onSortingChange={setSorting}
                pagination={pagination}
                onPaginationChange={setPagination}
                search={search}
                onSearchChange={(value) => {
                    setSearch(value);
                    setPagination((previous) => ({ ...previous, pageIndex: 0 }));
                }}
                filters={filters}
                actions={canManage ? actions : undefined}
                rowCount={data?.pagination?.totalItems ?? 0}
                rowCountLabel={`${data?.pagination?.totalItems === 0 ? 'No' : (data?.pagination?.totalItems ?? 0)} Invitations`}
                isLoading={isUserLoading || isLoading}
                emptyMessage="No customer invitations match the current filters."
            />

            <CreateDialog<CreateInvitationForm>
                key={`create-invitation-${createOpen}`}
                open={createOpen}
                onOpenChange={setCreateOpen}
                title="Invite Customer"
                description="Send an invitation to link an existing customer with your organization."
                resolver={zodResolver(createInvitationSchema)}
                defaultValues={{ recipientEmail: '' }}
                fields={fields}
                submitLabel="Send Invitation"
                onSubmit={async (values) => {
                    try {
                        await toast.promise(
                            createMutation.mutateAsync({
                                recipientEmail: values.recipientEmail,
                            }),
                            {
                                loading: 'Sending invitation...',
                                success: 'Invitation sent',
                                error: (mutationError) =>
                                    getApiErrorMessage(
                                        mutationError,
                                        'Failed to send invitation',
                                    ),
                            },
                        );

                        setCreateOpen(false);
                    } catch {
                        // Error is surfaced by toast.promise.
                    }
                }}
            />
        </ManagementPage>
    );
}
