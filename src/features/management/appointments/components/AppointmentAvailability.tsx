import { ChevronDown, UserCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';

import { AppointmentTimeType } from '../../../../models/enums/appointment-time-type.ts';

import type {
    SchedulingOption,
    SchedulingWorkerGroup,
} from '../../../../models/scheduling.model.ts';

import type { SchedulingForm } from '../../../../zod-schemas/scheduling.schema.ts';

import type { CreateAppointmentFormInput } from '../../../../zod-schemas/appointment.schema.ts';

import { useOrganizationScheduling } from '../../hooks/scheduling-hook.ts';

import {
    formatDateInTimeZone,
    formatTimeInTimeZone,
    getCurrentDateTimeInTimeZone,
    organizationLocalToUTC,
} from '../../user-view/utils/timezone.ts';

interface AppointmentAvailabilityProps {
    organizationUuid?: string;
    organizationTimeZone: string;
    form: UseFormReturn<CreateAppointmentFormInput>;
    initialWorkerUuid?: string;
    onAppointmentWorkerChange?: (workerUuid: string | undefined) => void;
}

function isSameOption(
    first: SchedulingOption | undefined,
    second: SchedulingOption | undefined,
): boolean {
    if (!first || !second) {
        return false;
    }

    return (
        first.room.uuid === second.room.uuid &&
        first.scheduledStartAtUTC === second.scheduledStartAtUTC
    );
}

function WorkerAvailabilityGroup({
    group,
    selectedOption,
    onSelect,
    organizationTimeZone,
    expanded,
    onToggle,
}: {
    group: SchedulingWorkerGroup;
    selectedOption?: SchedulingOption;
    onSelect: (option: SchedulingOption) => void;
    organizationTimeZone: string;
    expanded: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="overflow-hidden rounded-lg border border-[#d3d3df] bg-white">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-3 border-b border-[#d3d3df] bg-[#ededf2] px-3 py-2.5 text-left transition-colors hover:bg-[#e5e5ed]"
                aria-expanded={expanded}
            >
                <div className="min-w-0">
                    <p className="truncate text-[10px] font-semibold text-[#343447]">
                        {group.worker.firstName} {group.worker.lastName}
                    </p>

                    <p className="mt-0.5 text-[9px] text-[#777789]">
                        {group.options.length}{' '}
                        {group.options.length === 1 ? 'available time' : 'available times'}
                    </p>
                </div>

                <ChevronDown
                    className={[
                        'size-4 shrink-0 text-[#777789] transition-transform duration-200',
                        expanded ? 'rotate-180' : 'rotate-0',
                    ].join(' ')}
                />
            </button>

            <div
                className={[
                    'grid transition-all duration-200 ease-in-out',
                    expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                ].join(' ')}
            >
                <div className="min-h-0 overflow-hidden">
                    <div
                        className={[
                            'flex flex-col gap-1.5 p-2 transition-transform duration-200',
                            expanded ? 'translate-y-0' : '-translate-y-1',
                        ].join(' ')}
                    >
                        {group.options.map((option) => {
                            const selected = isSameOption(selectedOption, option);

                            return (
                                <button
                                    key={`${group.worker.uuid}-${option.room.uuid}-${option.scheduledStartAtUTC}`}
                                    type="button"
                                    onClick={() => onSelect(option)}
                                    className={[
                                        'group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors',
                                        selected
                                            ? 'border-[#343447] bg-[#ededf2]'
                                            : 'border-[#d3d3df] bg-[#f5f5f8] hover:bg-[#ededf2]',
                                    ].join(' ')}
                                >
                                    <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#d3d3df]">
                                        <div
                                            className={[
                                                'flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full transition-colors',
                                                selected
                                                    ? 'bg-[#ededf2]'
                                                    : 'bg-[#f5f5f8] group-hover:bg-[#ededf2]',
                                            ].join(' ')}
                                        >
                                            {group.worker.profilePicturePath ===
                                            'DEFAULT_PICTURE_PATH' ? (
                                                <UserCircle className="h-6 w-6 text-[#555566]" />
                                            ) : (
                                                <img
                                                    src={group.worker.profilePicturePath}
                                                    alt={`${group.worker.firstName} ${group.worker.lastName}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-[10px] font-semibold text-[#343447]">
                                                {formatDateInTimeZone(
                                                    option.scheduledStartAtUTC,
                                                    organizationTimeZone,
                                                )}
                                            </p>

                                            <span className="text-[9px] text-[#777789]">
                                                {formatTimeInTimeZone(
                                                    option.scheduledStartAtUTC,
                                                    organizationTimeZone,
                                                )}
                                                {' - '}
                                                {formatTimeInTimeZone(
                                                    option.scheduledEndAtUTC,
                                                    organizationTimeZone,
                                                )}
                                            </span>
                                        </div>

                                        <p className="mt-0.5 truncate text-[9px] text-[#777789]">
                                            {option.room.name}
                                        </p>
                                    </div>

                                    <div
                                        className={[
                                            'flex size-4 shrink-0 items-center justify-center rounded-full border text-[9px]',
                                            selected
                                                ? 'border-[#343447] bg-[#343447] text-white'
                                                : 'border-[#b9b9cc] text-transparent',
                                        ].join(' ')}
                                    >
                                        ✓
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AppointmentAvailability({
    organizationUuid,
    organizationTimeZone,
    form,
    initialWorkerUuid,
    onAppointmentWorkerChange,
}: AppointmentAvailabilityProps) {
    const userUuid = useWatch({
        control: form.control,
        name: 'userUuid',
    });

    const serviceUuid = useWatch({
        control: form.control,
        name: 'serviceUuid',
    });

    const timeType = useWatch({
        control: form.control,
        name: 'timeType',
    });

    const workerUuid = useWatch({
        control: form.control,
        name: 'workerUuid',
    });

    const fromAtUTC = useWatch({
        control: form.control,
        name: 'fromAtUTC',
    });

    const scheduledStartAtUTC = useWatch({
        control: form.control,
        name: 'scheduledStartAtUTC',
    });

    const previousTimeType = useRef<AppointmentTimeType | undefined>(timeType);

    /*
     * This state controls ONLY which worker group is visually expanded.
     *
     * It does not mean that the worker is selected for the appointment.
     */
    const [expandedWorkerUuid, setExpandedWorkerUuid] = useState<string | undefined>(
        initialWorkerUuid,
    );

    /*
     * The worker passed by the calendar is only the initial expanded worker.
     *
     * It must not override later user selections.
     */
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setExpandedWorkerUuid(initialWorkerUuid);
    }, [initialWorkerUuid]);

    /*
     * Ensure the form always has a valid default time type.
     */
    useEffect(() => {
        if (timeType) {
            return;
        }

        form.setValue('timeType', AppointmentTimeType.NEAREST, {
            shouldDirty: false,
            shouldValidate: true,
        });
    }, [timeType, form]);

    /*
     * When entering WORKER mode, initialize the form worker
     * from the worker that opened the dialog if necessary.
     *
     * This applies only to WORKER mode.
     */
    useEffect(() => {
        const changedToWorker =
            previousTimeType.current !== AppointmentTimeType.WORKER &&
            timeType === AppointmentTimeType.WORKER;

        if (changedToWorker && initialWorkerUuid) {
            form.setValue('workerUuid', initialWorkerUuid, {
                shouldDirty: true,
                shouldValidate: true,
            });

            onAppointmentWorkerChange?.(initialWorkerUuid);
        }

        previousTimeType.current = timeType;
    }, [timeType, initialWorkerUuid, form, onAppointmentWorkerChange]);

    /*
     * NEAREST mode requires a starting point.
     */
    useEffect(() => {
        if (timeType !== AppointmentTimeType.NEAREST || fromAtUTC) {
            return;
        }

        form.setValue('fromAtUTC', getCurrentDateTimeInTimeZone(organizationTimeZone), {
            shouldDirty: false,
            shouldValidate: true,
        });
    }, [timeType, organizationTimeZone, fromAtUTC, form]);

    /*
     * Reset the selected availability whenever the scheduling inputs change.
     *
     * A previous selected time must never remain valid after changing
     * the customer, service, or availability mode.
     *
     * In NEAREST mode:
     * - workerUuid is NOT used
     * - the worker is selected only when an actual availability option
     *   is clicked
     *
     * Therefore entering NEAREST mode clears the appointment-worker
     * selection in the parent.
     */
    useEffect(() => {
        form.setValue('scheduledStartAtUTC', '', {
            shouldDirty: false,
            shouldValidate: false,
        });

        form.setValue('roomUuid', '', {
            shouldDirty: false,
            shouldValidate: false,
        });

        if (timeType === AppointmentTimeType.NEAREST) {
            onAppointmentWorkerChange?.(undefined);

            return;
        }

        if (timeType === AppointmentTimeType.WORKER) {
            form.setValue('fromAtUTC', '', {
                shouldDirty: false,
                shouldValidate: false,
            });

            /*
             * When switching to WORKER mode:
             *
             * - use the currently selected worker if there is one
             * - otherwise use the worker from the schedule card
             */
            const selectedWorkerUuid = workerUuid || initialWorkerUuid;

            if (!workerUuid && initialWorkerUuid) {
                form.setValue('workerUuid', initialWorkerUuid, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
            }

            onAppointmentWorkerChange?.(selectedWorkerUuid || undefined);
        }
    }, [
        userUuid,
        serviceUuid,
        timeType,
        workerUuid,
        initialWorkerUuid,
        form,
        onAppointmentWorkerChange,
    ]);

    /*
     * WORKER mode starts searching from the current instant.
     *
     * Recompute when the scheduling inputs change.
     */
    const workerModeStart = useMemo(
        () => new Date().toISOString(),
        [userUuid, serviceUuid, timeType, workerUuid],
    );

    const searchStartAtUTC = useMemo(() => {
        if (timeType === AppointmentTimeType.NEAREST) {
            if (!fromAtUTC) {
                return undefined;
            }

            try {
                return organizationLocalToUTC(fromAtUTC, organizationTimeZone);
            } catch {
                return undefined;
            }
        }

        if (timeType === AppointmentTimeType.WORKER) {
            return workerModeStart;
        }

        return undefined;
    }, [timeType, fromAtUTC, organizationTimeZone, workerModeStart]);

    /*
     * Only WORKER mode sends workerUuid to the scheduling API.
     *
     * NEAREST mode deliberately sends no workerUuid so that the
     * scheduling API returns all available workers.
     */
    const schedulingWorkerUuid =
        timeType === AppointmentTimeType.WORKER && workerUuid ? workerUuid : undefined;

    const schedulingRequest = useMemo<SchedulingForm | undefined>(() => {
        if (!userUuid || !serviceUuid || !timeType) {
            return undefined;
        }

        if (timeType === AppointmentTimeType.WORKER) {
            if (!schedulingWorkerUuid) {
                return undefined;
            }

            return {
                userUuid,
                serviceUuid,
                timeType,
                workerUuid: schedulingWorkerUuid,
            };
        }

        if (timeType === AppointmentTimeType.NEAREST) {
            if (!searchStartAtUTC) {
                return undefined;
            }

            return {
                userUuid,
                serviceUuid,
                timeType,
                fromAtUTC: searchStartAtUTC,
            };
        }

        return undefined;
    }, [userUuid, serviceUuid, timeType, schedulingWorkerUuid, searchStartAtUTC]);

    const { data, isLoading, isFetching, isError } = useOrganizationScheduling(
        organizationUuid,
        schedulingRequest,
    );

    const workerGroups = useMemo(() => data?.workers ?? [], [data?.workers]);

    const options = useMemo(() => workerGroups.flatMap((group) => group.options), [workerGroups]);

    /*
     * Find the currently selected availability option.
     *
     * In WORKER mode:
     * search only within the selected worker's group.
     *
     * In NEAREST mode:
     * workerUuid is deliberately not stored in the form, so the
     * selected availability is identified by the scheduled start
     * time across all returned workers.
     */
    const selectedOption = useMemo(() => {
        if (!scheduledStartAtUTC) {
            return undefined;
        }

        if (timeType === AppointmentTimeType.WORKER && workerUuid) {
            const workerGroup = workerGroups.find((group) => group.worker.uuid === workerUuid);

            return workerGroup?.options.find(
                (option) => option.scheduledStartAtUTC === scheduledStartAtUTC,
            );
        }

        return options.find((option) => option.scheduledStartAtUTC === scheduledStartAtUTC);
    }, [timeType, workerUuid, scheduledStartAtUTC, workerGroups, options]);

    /*
     * Selecting an option is the ONLY thing that selects a worker
     * in NEAREST mode.
     *
     * The initial worker is NOT automatically selected.
     *
     * The initial worker is only expanded visually.
     */
    const handleSelect = (option: SchedulingOption, selectedWorkerUuid: string) => {
        if (timeType === AppointmentTimeType.WORKER) {
            form.setValue('workerUuid', selectedWorkerUuid, {
                shouldDirty: true,
                shouldValidate: false,
            });

            form.setValue('roomUuid', option.room.uuid, {
                shouldDirty: true,
                shouldValidate: false,
            });

            form.clearErrors('workerUuid');
            form.clearErrors('roomUuid');
        }

        if (timeType === AppointmentTimeType.NEAREST) {
            /*
             * Do NOT write workerUuid to the form.
             *
             * The selected worker is stored by the parent because
             * workerUuid is intentionally absent from the NEAREST
             * scheduling form state.
             */
            onAppointmentWorkerChange?.(selectedWorkerUuid);
        }

        form.setValue('scheduledStartAtUTC', option.scheduledStartAtUTC, {
            shouldDirty: true,
            shouldValidate: false,
        });

        /*
         * Selecting an option opens that worker's group.
         *
         * This is purely UI state.
         */
        setExpandedWorkerUuid(selectedWorkerUuid);

        form.clearErrors('scheduledStartAtUTC');

        void form.trigger(
            timeType === AppointmentTimeType.WORKER
                ? ['workerUuid', 'roomUuid', 'scheduledStartAtUTC']
                : ['scheduledStartAtUTC'],
        );
    };

    /*
     * Expansion is completely independent from selection.
     *
     * The user can:
     * - collapse the initial worker
     * - expand another worker
     * - collapse that worker
     * - expand a different worker
     *
     * No appointment worker is selected by doing this.
     */
    const handleToggleWorker = (selectedWorkerUuid: string) => {
        setExpandedWorkerUuid((current) =>
            current === selectedWorkerUuid ? undefined : selectedWorkerUuid,
        );
    };

    if (!organizationUuid) {
        return (
            <div className="rounded-lg border border-[#d3d3df] bg-[#f5f5f8] px-3 py-3">
                <p className="text-[10px] text-[#777789]">
                    Organization is required to find available times.
                </p>
            </div>
        );
    }

    if (!userUuid || !serviceUuid) {
        return (
            <div className="rounded-lg border border-[#d3d3df] bg-[#f5f5f8] px-3 py-3">
                <p className="text-[10px] text-[#777789]">
                    Select a customer and service to view available times.
                </p>
            </div>
        );
    }

    if (timeType === AppointmentTimeType.WORKER && !workerUuid) {
        return (
            <div className="rounded-lg border border-[#d3d3df] bg-[#f5f5f8] px-3 py-3">
                <p className="text-[10px] text-[#777789]">
                    Select a worker to view available times.
                </p>
            </div>
        );
    }

    if (timeType === AppointmentTimeType.NEAREST && !fromAtUTC) {
        return (
            <div className="rounded-lg border border-[#d3d3df] bg-[#f5f5f8] px-3 py-3">
                <p className="text-[10px] text-[#777789]">
                    Select a start time to find available times.
                </p>
            </div>
        );
    }

    if (isLoading || isFetching) {
        return (
            <div className="rounded-lg border border-[#d3d3df] bg-[#f5f5f8] px-3 py-3">
                <p className="text-[10px] text-[#777789]">Finding available times...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-lg border border-[#c94a5c]/40 bg-[#f5f5f8] px-3 py-3">
                <p className="text-[10px] text-[#c94a5c]">Failed to load available times.</p>
            </div>
        );
    }

    if (workerGroups.length === 0) {
        return (
            <div className="rounded-lg border border-[#d3d3df] bg-[#f5f5f8] px-3 py-3">
                <p className="text-[10px] font-medium text-[#343447]">No available times</p>

                <p className="mt-0.5 text-[9px] text-[#777789]">
                    Try another worker, availability type, or starting time.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-[#343447]">Available Times</p>

                <span className="text-[9px] text-[#777789]">
                    {workerGroups.length} {workerGroups.length === 1 ? 'worker' : 'workers'}
                </span>
            </div>

            <div className="flex flex-col gap-2">
                {workerGroups.map((group) => (
                    <WorkerAvailabilityGroup
                        key={group.worker.uuid}
                        group={group}
                        organizationTimeZone={organizationTimeZone}
                        selectedOption={selectedOption}
                        expanded={expandedWorkerUuid === group.worker.uuid}
                        onToggle={() => handleToggleWorker(group.worker.uuid)}
                        onSelect={(option) => handleSelect(option, group.worker.uuid)}
                    />
                ))}
            </div>
        </div>
    );
}
