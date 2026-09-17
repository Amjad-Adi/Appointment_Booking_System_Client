import { useState } from 'react';

import type { PaginationState, SortingState } from '@tanstack/react-table';

import { Plus } from 'lucide-react';

import type { InvitationResponse } from '../../../../../../models/invitation.model.ts';

import { useOrganizationInvitations } from '../../../../hooks/invitation-hook.ts';
import { useCurrentUser } from '../../../../hooks/users-hook.ts';

import { DataTable } from '../../../../../../components/DataTable.tsx';
import { Select } from '../../../../../../components/Select.tsx';
import { Button } from '../../../../../../components/Button.tsx';
import { PAGE_SIZE } from '../../../../../../components/DataTableFeatures.ts';

import { CreateInvitationDialog } from '../components/CreateInvitationDialog.tsx';
import { EditInvitationDialog } from '../components/EditInvitationDialog.tsx';
import { getInvitationColumns } from '../columns/InvitationColumns.tsx';

import { useDialog } from '../../../../../../hooks/open-dialog.ts';

import { Order } from '../../../../../../models/enums/order.ts';
import { InvitationStatus } from '../../../../../../models/enums/invitation-status.ts';

import { GENERAL_DEBOUNCE_DELAY, useDebounce } from '../../../../../../hooks/deounce.ts';

export interface InvitationsTableProps {
    organizationUuid?: string;
}
export function InvitationsTable({ organizationUuid }: InvitationsTableProps) {
    const { data: currentUser } = useCurrentUser();

    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, GENERAL_DEBOUNCE_DELAY);
    const [status, setStatus] = useState<InvitationStatus | undefined>();
    const [createInvitationOpen, setCreateInvitationOpen] = useState(false);

    const invitationDialog = useDialog<InvitationResponse>();

    const canManageInvitations =
        currentUser?.organizationUuid === organizationUuid && currentUser?.organizationUuid != null;

    const sort = sorting[0];
    const sortBy: 'createdAtUTC' | 'expiresAtUTC' | undefined = sort
        ? sort.id === 'expiresAtUTC'
            ? 'expiresAtUTC'
            : 'createdAtUTC'
        : undefined;

    const order = sort ? (sort.desc ? Order.DESC : Order.ASC) : undefined;

    const { data, isLoading, isError } = useOrganizationInvitations(organizationUuid, {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy,
        order,
        search: debouncedSearch || undefined,
        filter: {
            ...(status && {
                status,
            }),
        },
    });

    // Ensure getInvitationColumns doesn't execute hooks internally inside the function body
    const columns = getInvitationColumns(canManageInvitations ? invitationDialog.open : undefined);

    const resetPage = () => {
        setPagination((previous) => ({
            ...previous,
            pageIndex: 0,
        }));
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        resetPage();
    };

    const filters = (
        <div className="flex w-full min-w-0 flex-wrap items-center gap-2">
            <Select
                label="Status"
                isLabelDisabled
                value={status ?? ''}
                onChange={(event) => {
                    const value = event.target.value;
                    setStatus(value === '' ? undefined : (value as InvitationStatus));
                    resetPage();
                }}
                wrapperClassName="w-36 max-sm:w-[48%] max-[350px]:w-full"
                className="!h-8 px-2 text-[11px]"
            >
                <option value="">All statuses</option>
                {Object.values(InvitationStatus).map((statusValue) => (
                    <option key={statusValue} value={statusValue}>
                        {statusValue}
                    </option>
                ))}
            </Select>
        </div>
    );

    const actions = (
        <div className="flex shrink-0 items-center gap-2">
            {canManageInvitations && (
                <Button
                    type="button"
                    onClick={() => setCreateInvitationOpen(true)}
                    className="flex h-8 min-h-0 w-auto shrink-0 items-center gap-1.5 px-3 text-[11px]"
                >
                    <Plus className="size-3.5" strokeWidth={2} />
                    Invite User
                </Button>
            )}
        </div>
    );

    // Pass isLoading or handle conditional views inside the final JSX render
    if (isError) {
        return <div>Failed to load invitations.</div>;
    }

    return (
        <>
            <DataTable
                tableKey="organization-invitations-table"
                data={data?.data ?? []}
                columns={columns}
                sorting={sorting}
                onSortingChange={setSorting}
                pagination={pagination}
                onPaginationChange={setPagination}
                search={search}
                onSearchChange={handleSearchChange}
                filters={filters}
                actions={actions}
                rowCount={data?.pagination?.totalItems ?? 0}
                rowCountLabel={`${
                    data?.pagination?.totalItems === 0 ? 'No' : data?.pagination?.totalItems
                } Invitations`}
            />

            {canManageInvitations && (
                <CreateInvitationDialog
                    organizationUuid={organizationUuid}
                    open={createInvitationOpen}
                    onOpenChange={setCreateInvitationOpen}
                />
            )}

            {canManageInvitations && invitationDialog.selectedItem && (
                <EditInvitationDialog
                    organizationUuid={organizationUuid}
                    invitation={invitationDialog.selectedItem}
                    open={invitationDialog.isOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            invitationDialog.close();
                        }
                    }}
                />
            )}
        </>
    );
}
