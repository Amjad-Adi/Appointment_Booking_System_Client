import { BedDouble, Clock3, Info, Pencil, UserRound } from 'lucide-react';

import type { RoomResponse } from '../../../../../../models/room.model.ts';

import { Button } from '../../../../../../components/Button.tsx';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../../../../../../../@/components/ui/Tooltip.tsx';

import { ActivationStatusRender } from '../../../../components/ActivationStatusRender.tsx';

interface RoomCardProps {
    room: RoomResponse;
    canEdit?: boolean;
    onEdit?: (room: RoomResponse) => void;
}

export function RoomCard({ room, canEdit = false, onEdit }: RoomCardProps) {
    const hasDescription = Boolean(room.description?.trim());

    const assignedUserName = room.userUuid
        ? [room.firstName, room.lastName].filter(Boolean).join(' ')
        : 'No Assigned User';

    return (
        <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#d3d3df] bg-white shadow-sm">
            <div className="relative flex h-28 items-center justify-center bg-[#dedee8]">
                <BedDouble className="size-12 text-[#777789]" strokeWidth={1.3} />

                <div className="absolute top-2 right-2">
                    <ActivationStatusRender status={room.status} />
                </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3 p-3">
                <div className="flex min-w-0 items-center gap-1.5">
                    <h3 className="min-w-0 truncate text-sm font-semibold text-[#343447]">
                        {room.name}
                    </h3>

                    {hasDescription ? (
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <span className="shrink-0 cursor-default">
                                        <Info
                                            className="size-3.5 text-[#777789]"
                                            strokeWidth={1.8}
                                        />
                                    </span>
                                }
                            />

                            <TooltipContent
                                side="top"
                                align="center"
                                className="max-w-xs text-[11px] leading-4 whitespace-normal"
                            >
                                {room.description}
                            </TooltipContent>
                        </Tooltip>
                    ) : null}
                </div>

                <div className="flex flex-col gap-1.5 text-[11px] text-[#777789]">
                    <div className="flex items-center gap-1.5">
                        <BedDouble className="size-3.5" />
                        <span>{room.occupancyStatus}</span>
                    </div>

                    {assignedUserName ? (
                        <div className="flex min-w-0 items-center gap-1.5">
                            <UserRound className="size-3.5 shrink-0" />
                            <span className="truncate">{assignedUserName}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5">
                            <UserRound className="size-3.5" />
                            <span>Unassigned</span>
                        </div>
                    )}
                </div>

                <div className="mt-auto flex items-center gap-2">
                    <Button type="button" className="h-8 flex-1 px-3 text-[11px]">
                        View Room
                    </Button>

                    {canEdit && onEdit ? (
                        <Button
                            type="button"
                            onClick={() => onEdit(room)}
                            className="flex h-8 w-8 items-center justify-center p-0"
                            aria-label={`Edit ${room.name}`}
                        >
                            <Pencil className="size-3.5" />
                        </Button>
                    ) : null}
                </div>
            </div>
        </article>
    );
}
