import { DoorOpen, User, CalendarDays, Pencil, Info } from 'lucide-react';

import type { RoomResponse } from '../../../../../../models/room.model.ts';

import { ActivationStatusRender } from '../../../../components/ActivationStatusRender.tsx';
import { BackButton } from '../../../../components/BackButton.tsx';
import { Button } from '../../../../../../components/Button.tsx';

interface RoomProfileProps {
    room: RoomResponse;
    canEdit?: boolean;
    onEdit?: () => void;
}

export function RoomProfile({ room, canEdit = false, onEdit }: RoomProfileProps) {
    const assignedUserName = room.userUuid
        ? [room.firstName, room.lastName].filter(Boolean).join(' ')
        : '';

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-4">
            {/* Actions */}
            <div className="flex min-w-0 items-center justify-between gap-3">
                <BackButton backPath="/organization/rooms" />

                {canEdit && onEdit ? (
                    <Button
                        type="button"
                        onClick={onEdit}
                        className="flex h-8 items-center gap-1.5 px-3 text-[11px]"
                    >
                        <Pencil className="size-3.5" strokeWidth={1.8} />
                        Edit
                    </Button>
                ) : null}
            </div>

            {/* Room header */}
            <section className="overflow-hidden rounded-xl border border-[#d3d3df] bg-white shadow-sm">
                <div className="relative h-40 bg-[#f5f5f8]">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex size-24 items-center justify-center overflow-hidden rounded-2xl border border-[#d3d3df] bg-[#ededf2] shadow-sm">
                            <DoorOpen className="size-10 text-[#777789]" strokeWidth={1.5} />
                        </div>
                    </div>

                    <div className="absolute top-3 right-3 rounded-full border border-[#d3d3df] bg-white px-2.5 py-1 shadow-sm">
                        {ActivationStatusRender({
                            status: room.status,
                        })}
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex min-w-0 flex-col gap-2">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <h1 className="min-w-0 truncate text-xl font-semibold text-[#343447]">
                                {room.name}
                            </h1>

                            <span className="text-[11px] text-[#777789]">Room</span>
                        </div>

                        <p className="max-w-3xl text-[12px] leading-5 text-[#777789]">
                            {room.description || 'No description available.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Room information */}
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Occupancy Status */}
                <section className="rounded-xl border border-[#d3d3df] bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#ededf2]">
                            <DoorOpen className="size-4 text-[#777789]" strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium tracking-wide text-[#777789] uppercase">
                                Occupancy
                            </p>

                            <p className="mt-0.5 truncate text-lg font-semibold text-[#343447]">
                                {room.occupancyStatus}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Assigned User */}
                <section className="rounded-xl border border-[#d3d3df] bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#ededf2]">
                            <User className="size-4 text-[#777789]" strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium tracking-wide text-[#777789] uppercase">
                                Assigned User
                            </p>

                            <p className="mt-0.5 truncate text-lg font-semibold text-[#343447]">
                                {assignedUserName || 'Unassigned'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Created At */}
                <section className="rounded-xl border border-[#d3d3df] bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#ededf2]">
                            <CalendarDays className="size-4 text-[#777789]" strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium tracking-wide text-[#777789] uppercase">
                                Created At
                            </p>

                            <p className="mt-0.5 text-lg font-semibold text-[#343447]">
                                {new Date(room.createdAtUTC).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Room details */}
            <section className="rounded-xl border border-[#d3d3df] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#ededf2]">
                        <Info className="size-4 text-[#777789]" strokeWidth={1.8} />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-[#343447]">Room Details</h2>

                        <p className="text-[10px] text-[#777789]">
                            Additional information about this room
                        </p>
                    </div>
                </div>

                <div className="mt-4 rounded-lg border border-[#d3d3df] bg-[#f5f5f8] p-3">
                    <p className="text-[11px] leading-5 text-[#777789]">
                        {room.description || 'No description available.'}
                    </p>
                </div>
            </section>
        </div>
    );
}
