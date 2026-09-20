import { useState } from 'react';
import { type PaginationState, type SortingState } from '@tanstack/react-table';
import { Plus } from 'lucide-react';

import { DataTable } from '../../../../../../../components/DataTable.tsx';
import { PAGE_SIZE } from '../../../../../../../components/DataTableFeatures.ts';
import { Select } from '../../../../../../../components/Select.tsx';
import { Button } from '../../../../../../../components/Button.tsx';
import { useDebounce, GENERAL_DEBOUNCE_DELAY } from '../../../../../../../hooks/deounce.ts';
import { Order } from '../../../../../../../models/enums/order.ts';
import { InvitationStatus } from '../../../../../../../models/enums/invitation-status.ts';
import type {
    InvitationResponse,
    QueryInvitation,
} from '../../../../../../../models/invitation.model.ts';
import { useOrganizationInvitations } from '../../../../../hooks/invitation-hook.ts';
import { getOrganizationInvitationColumns } from '../columns/OrganizationInvitationColumns.tsx';
import { CreateInvitationDialog } from '../components/CreateInvitationDialog.tsx';
import { useDialog } from '../../../../../../../hooks/open-dialog.ts';
import { EditInvitationDialog } from '../components/EditInvitationDialog.tsx';

interface OrganizationInvitationsTableProps {
    organizationUuid: string;
}

export function OrganizationInvitationsTable({
    organizationUuid,
}: OrganizationInvitationsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });

    const [search, setSearch] = useState('');
    const debounceSearch = useDebounce(search, GENERAL_DEBOUNCE_DELAY);
    const [status, setStatus] = useState<InvitationStatus | undefined>();

    const createDialog = useDialog();
    const editDialog = useDialog<InvitationResponse>();

    const columns = getOrganizationInvitationColumns(editDialog.open);

    const sort = sorting[0];
    const sortBy = sort
        ? sort.id === 'createdAtUTC'
            ? 'createdAtUTC'
            : 'expiresAtUTC'
        : undefined;
    const order = sort ? (sort.desc ? Order.DESC : Order.ASC) : undefined;

    const query: QueryInvitation = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy,
        order,
        search: debounceSearch || undefined,
        filter: { ...(status && { status }) },
    };

    const { data, isError, isLoading } = useOrganizationInvitations(organizationUuid, query);

    const filters = (
        <div className="flex min-w-0 flex-1 gap-2 max-sm:justify-between sm:gap-[4%]">
            <Select
                label="Status"
                isLabelDisabled
                value={status ?? ''}
                onChange={(event) => {
                    const value = event.target.value;
                    setStatus(value === '' ? undefined : (value as InvitationStatus));
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                wrapperClassName="w-40 max-sm:w-[48%] max-[350px]:w-full"
                className="!h-8 px-2 text-[11px]"
            >
                <option value="">All statuses</option>
                {Object.values(InvitationStatus).map((stat) => (
                    <option key={stat} value={stat}>
                        {stat}
                    </option>
                ))}
            </Select>
        </div>
    );

    if (isLoading) {
        return (
            <div className="py-8 text-center text-[11px] text-[#777789]">
                Loading invitations...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="py-8 text-center text-[11px] text-[#c94a5c]">
                Failed to load invitations.
            </div>
        );
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
                onSearchChange={setSearch}
                filters={filters}
                actions={
                    <Button
                        type="button"
                        onClick={() => createDialog.open()}
                        className="flex h-8 min-h-0 w-auto shrink-0 items-center gap-1.5 px-3 text-[11px] font-semibold"
                    >
                        <Plus className="size-3.5" strokeWidth={2} />
                        Add Invitation
                    </Button>
                }
                rowCount={data?.pagination?.totalItems ?? 0}
                rowCountLabel={`${data?.pagination?.totalItems === 0 ? 'No' : data?.pagination?.totalItems} Invitations`}
            />

            <CreateInvitationDialog
                organizationUuid={organizationUuid}
                open={createDialog.isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        createDialog.close();
                    }
                }}
            />

            {editDialog.selectedItem && (
                <EditInvitationDialog
                    organizationUuid={organizationUuid}
                    invitation={editDialog.selectedItem}
                    open={editDialog.isOpen}
                    onOpenChange={(open) => !open && editDialog.close()}
                />
            )}
        </>
    );
}
