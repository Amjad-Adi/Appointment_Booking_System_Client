import { useMemo, useState } from 'react';
import { type PaginationState, type SortingState } from '@tanstack/react-table';
import toast from 'react-hot-toast';

import type {
    WorkingHours,
    WorkingHoursResponse,
} from '../../../../../../../../models/working-hours.model.ts';
import { DayOfWeek } from '../../../../../../../../models/enums/day-of-week.ts';
import { dayOfWeekRecord } from '../../../../../../../../models/enums-mapping/day-of-week.ts';

import { DataTable } from '../../../../../../../../components/DataTable.tsx';
import { useUpdateOrganizationWorkingHours } from '../../../../../../hooks/working-hours-hook.ts';
import { getApiErrorMessage } from '../../../../../../../../utlis/api-error.ts';
import { GENERAL_DEBOUNCE_DELAY, useDebounce } from '../../../../../../../../hooks/deounce.ts';
import { useDialog } from '../../../../../../../../hooks/open-dialog.ts';

import { getWorkingHoursColumns, type CopiedTime } from './WorkingHoursColumns.tsx';
import { EditWorkingHourDialog } from './EditWorkingHourDialog.tsx';

interface WorkingHoursTableProps {
    organizationUuid: string;
    workingHours: WorkingHoursResponse[];
    canEdit: boolean;
}

const DAY_ORDER: DayOfWeek[] = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY,
];

const normalizeTime = (time: string | null): string | null => (time ? time.slice(0, 5) : null);

export function WorkingHoursTable({
    organizationUuid,
    workingHours,
    canEdit,
}: WorkingHoursTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, GENERAL_DEBOUNCE_DELAY);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 7,
    });

    const updateMutation = useUpdateOrganizationWorkingHours(organizationUuid);

    const singleEditDialog = useDialog<WorkingHours>();

    const [copiedTime, setCopiedTime] = useState<CopiedTime | null>(null);

    const normalizedData = useMemo(() => {
        const map = new Map(workingHours.map((day) => [day.dayOfWeek, day]));

        return DAY_ORDER.map((dayOfWeek) => {
            return (
                map.get(dayOfWeek) ??
                ({
                    uuid: `empty-${dayOfWeek}`,
                    dayOfWeek,
                    startTime: null,
                    endTime: null,
                } as WorkingHours)
            );
        });
    }, [workingHours]);

    const filteredData = useMemo(() => {
        const normalizedSearch = debouncedSearch.trim().toLowerCase();

        if (!normalizedSearch) {
            return normalizedData;
        }

        return normalizedData.filter((workingHour) =>
            dayOfWeekRecord[workingHour.dayOfWeek].toLowerCase().includes(normalizedSearch),
        );
    }, [normalizedData, debouncedSearch]);

    const handleCopy = (workingHour: WorkingHours) => {
        setCopiedTime({
            startTime: normalizeTime(workingHour.startTime),
            endTime: normalizeTime(workingHour.endTime),
        });

        toast.success(`Copied hours from ${dayOfWeekRecord[workingHour.dayOfWeek]}`);
    };

    const handlePaste = async (workingHour: WorkingHours) => {
        if (!copiedTime) return;
        if (workingHour.uuid.startsWith('empty-')) return;

        try {
            await toast.promise(
                updateMutation.mutateAsync({
                    uuid: workingHour.uuid,
                    startTime: normalizeTime(copiedTime.startTime),
                    endTime: normalizeTime(copiedTime.endTime),
                }),
                {
                    loading: `Pasting to ${dayOfWeekRecord[workingHour.dayOfWeek]}...`,
                    success: 'Time pasted successfully',
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to paste time'),
                },
            );
        } catch {
            // toast.promise already surfaced the error.
        }
    };

    const columns = getWorkingHoursColumns(
        singleEditDialog.open,
        handleCopy,
        handlePaste,
        copiedTime !== null,
        updateMutation.isPending,
    );

    const visibleColumns = canEdit ? columns : columns.filter((column) => column.id !== 'actions');

    return (
        <>
            <DataTable
                tableKey="working-hours-table"
                data={filteredData}
                columns={visibleColumns}
                sorting={sorting}
                onSortingChange={setSorting}
                pagination={pagination}
                onPaginationChange={setPagination}
                search={search}
                onSearchChange={(value) => {
                    setSearch(value);

                    setPagination((previous) => ({
                        ...previous,
                        pageIndex: 0,
                    }));
                }}
                rowCount={filteredData.length}
                rowCountLabel={`${filteredData.length === 0 ? 'No' : filteredData.length} Days`}
            />

            {singleEditDialog.selectedItem && (
                <EditWorkingHourDialog
                    organizationUuid={organizationUuid}
                    workingHour={singleEditDialog.selectedItem}
                    open={singleEditDialog.isOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            singleEditDialog.close();
                        }
                    }}
                />
            )}
        </>
    );
}
