import { useMemo, useState } from 'react';
import { type PaginationState, type SortingState } from '@tanstack/react-table';
import toast from 'react-hot-toast';

import type {
    WorkingHours,
    WorkingHoursResponse,
} from '../../../../../../../../models/working-hours.model.ts';
import { DayOfWeek } from '../../../../../../../../models/enums/day-of-week.ts';

import { DataTable } from '../../../../../../../../components/DataTable.tsx';
import { useUpdateOrganizationWorkingHours } from '../../../../../../hooks/working-hours-hook.ts';
import { Toast } from '../../../../../../../../utlis/toast.ts';
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
            workingHour.dayOfWeek.toLowerCase().includes(normalizedSearch),
        );
    }, [normalizedData, debouncedSearch]);

    const handleCopy = (workingHour: WorkingHours) => {
        setCopiedTime({
            startTime: workingHour.startTime,
            endTime: workingHour.endTime,
        });

        toast.success(`Copied hours from ${workingHour.dayOfWeek.toLowerCase()}`);
    };

    const handlePaste = async (workingHour: WorkingHours) => {
        if (!copiedTime) return;
        if (workingHour.uuid.startsWith('empty-')) return;

        await toast.promise(
            updateMutation.mutateAsync({
                uuid: workingHour.uuid,
                startTime: copiedTime.startTime,
                endTime: copiedTime.endTime,
            }),
            new Toast(
                `Pasting to ${workingHour.dayOfWeek.toLowerCase()}...`,
                'Time pasted successfully',
                'Failed to paste time',
            ),
        );
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
