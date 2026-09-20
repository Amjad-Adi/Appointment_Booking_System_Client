import type { WorkingHours } from '../../../../../../../../models/working-hours.model.ts';
import type { DataTableColumn } from '../../../../../../../../components/DataTableFeatures.ts';
import { Button } from '../../../../../../../../components/Button.tsx';
import { Clipboard, ClipboardPaste, Clock, MoreHorizontalIcon, Pencil } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../../../../../../../components/DropdownMenu.tsx';

export interface CopiedTime {
    startTime: string | null;
    endTime: string | null;
}

export function getWorkingHoursColumns(
    onEdit: (workingHour: WorkingHours) => void,
    onCopy: (workingHour: WorkingHours) => void,
    onPaste: (workingHour: WorkingHours) => void,
    hasCopiedTime: boolean,
    isPasting: boolean,
): DataTableColumn<WorkingHours>[] {
    return [
        {
            accessorKey: 'dayOfWeek',
            header: 'Day',
            enableSorting: false,
            cell: ({ row }) => {
                const day = row.original.dayOfWeek;
                return (
                    <span className="font-medium text-[#343447] capitalize">
                        {day.toLowerCase()}
                    </span>
                );
            },
        },
        {
            id: 'status',
            header: 'Status',
            enableSorting: false,
            cell: ({ row }) => {
                const isOpen = Boolean(row.original.startTime && row.original.endTime);
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d3d3df] bg-[#f5f5f8] px-2 py-0.5">
                        <span
                            className={`size-1.5 shrink-0 rounded-full ${
                                isOpen ? 'bg-[#10b981]' : 'bg-[#9999aa]'
                            }`}
                        />
                        <span className="text-[10px] font-medium text-[#454556]">
                            {isOpen ? 'Open' : 'Closed'}
                        </span>
                    </span>
                );
            },
        },
        {
            accessorKey: 'startTime',
            header: 'Opening Time',
            enableSorting: false,
            cell: ({ row }) => <FormattedTime time={row.original.startTime} />,
        },
        {
            accessorKey: 'endTime',
            header: 'Closing Time',
            enableSorting: false,
            cell: ({ row }) => <FormattedTime time={row.original.endTime} />,
        },
        {
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            cell: ({ row }) => (
                <DropdownMenu>
                    <div className="group">
                        <DropdownMenuTrigger
                            render={
                                <Button
                                    type="button"
                                    className="size-6 min-h-0 min-w-0 !border-transparent !bg-transparent p-0 text-[#777789] transition-transform duration-200 group-hover:-translate-y-0.5 hover:!bg-transparent sm:h-6 sm:w-6"
                                >
                                    <MoreHorizontalIcon className="size-4 shrink-0" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            }
                        />
                    </div>

                    <DropdownMenuContent className="flex flex-col justify-end p-1">
                        <DropdownMenuItem
                            className="flex h-7 items-center gap-2 px-2 text-[11px]"
                            onClick={() => onEdit(row.original)}
                        >
                            <Pencil className="size-3" />
                            Edit Hours
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-1 bg-[#d3d3df]" />

                        <DropdownMenuItem
                            className="flex h-7 items-center gap-2 px-2 text-[11px]"
                            onClick={() => onCopy(row.original)}
                        >
                            <Clipboard className="size-3" />
                            Copy Time
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className="flex h-7 items-center gap-2 px-2 text-[11px]"
                            disabled={!hasCopiedTime || isPasting}
                            onClick={() => onPaste(row.original)}
                        >
                            <ClipboardPaste className="size-3" />
                            Paste Time
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];
}

function FormattedTime({ time }: { time: string | null }) {
    if (!time) {
        return <span className="text-[#9999aa]">—</span>;
    }

    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    const formatted = `${h12.toString().padStart(2, '0')}:${minutes} ${ampm}`;

    return (
        <div className="flex items-center gap-1.5 text-[11px] text-[#454556]">
            <Clock className="size-3 text-[#777789]" />
            <span>{formatted}</span>
        </div>
    );
}
