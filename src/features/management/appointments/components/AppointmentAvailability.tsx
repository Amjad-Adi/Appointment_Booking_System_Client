import { ChevronDown, UserCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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

    /**
     * Worker from which the Add Appointment action was opened.
     *
     * This worker will initially be expanded and preferred when
     * automatically selecting the first available option.
     */
    initialWorkerUuid?: string;

    /**
     * Worker selected by the availability result for the actual
     * appointment.
     *
     * This is deliberately separate from form.workerUuid because
     * NEAREST scheduling must not send workerUuid to the scheduling API.
     */
    onAppointmentWorkerChange?: (workerUuid: string | undefined) => void;
}

function isSameOption(first: SchedulingOption | undefined, second: SchedulingOption | undefined) {
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
                                                {' – '}
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

    const [expandedWorkerUuid, setExpandedWorkerUuid] = useState<string | undefined>(
        initialWorkerUuid,
    );

    useEffect(() => {
        setExpandedWorkerUuid(initialWorkerUuid);
    }, [initialWorkerUuid]);

    useEffect(() => {
        if (timeType) {
            return;
        }

        form.setValue('timeType', AppointmentTimeType.NEAREST, {
            shouldDirty: false,
            shouldValidate: true,
        });
    }, [timeType, form]);

    useEffect(() => {
        if (timeType !== AppointmentTimeType.NEAREST) {
            return;
        }

        if (fromAtUTC) {
            return;
        }

        form.setValue('fromAtUTC', getCurrentDateTimeInTimeZone(organizationTimeZone), {
            shouldDirty: false,
            shouldValidate: true,
        });
    }, [timeType, organizationTimeZone, fromAtUTC, form]);

    /*
     * Reset availability whenever the customer, service, or
     * availability mode changes.
     */
    useEffect(() => {
        form.setValue('scheduledStartAtUTC', '', {
            shouldDirty: false,
            shouldValidate: false,
        });

        /*
         * NEAREST mode must not keep workerUuid in the scheduling form.
         * The selected worker is stored separately by the parent.
         */
        if (timeType === AppointmentTimeType.NEAREST) {
            form.setValue('workerUuid', '', {
                shouldDirty: false,
                shouldValidate: false,
            });

            form.setValue('roomUuid', '', {
                shouldDirty: false,
                shouldValidate: false,
            });

            onAppointmentWorkerChange?.(undefined);

            return;
        }

        if (timeType === AppointmentTimeType.WORKER) {
            form.setValue('fromAtUTC', '', {
                shouldDirty: false,
                shouldValidate: false,
            });

            form.setValue('roomUuid', '', {
                shouldDirty: false,
                shouldValidate: false,
            });

            /*
             * In WORKER mode the selected worker comes directly from
             * form.workerUuid.
             */
            onAppointmentWorkerChange?.(workerUuid || undefined);
        }
    }, [userUuid, serviceUuid, timeType, form, onAppointmentWorkerChange]);

    /*
     * In WORKER mode the scheduling search starts from now.
     *
     * workerUuid is intentionally included so changing the selected
     * worker creates a fresh search timestamp.
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
     * A worker is sent to the scheduling API only in WORKER mode.
     *
     * In NEAREST mode the scheduling service searches across workers.
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

    const selectedOption = useMemo(() => {
        if (!scheduledStartAtUTC) {
            return undefined;
        }

        /*
         * WORKER mode must find the selected option inside the
         * selected worker's group only.
         */
        if (timeType === AppointmentTimeType.WORKER && workerUuid) {
            const workerGroup = workerGroups.find((group) => group.worker.uuid === workerUuid);

            return workerGroup?.options.find(
                (option) => option.scheduledStartAtUTC === scheduledStartAtUTC,
            );
        }

        /*
         * NEAREST mode has no workerUuid in the form.
         *
         * The selected option is identified by its scheduled
         * start time.
         */
        return options.find((option) => option.scheduledStartAtUTC === scheduledStartAtUTC);
    }, [timeType, workerUuid, scheduledStartAtUTC, workerGroups, options]);

    /*
     * Automatically select the first available option in NEAREST mode.
     *
     * The worker is NOT written to form.workerUuid.
     * It is sent to the parent as the worker that should own
     * the actual appointment.
     */
    useEffect(() => {
        if (
            timeType !== AppointmentTimeType.NEAREST ||
            options.length === 0 ||
            scheduledStartAtUTC
        ) {
            return;
        }

        const initialWorkerGroup = initialWorkerUuid
            ? workerGroups.find((group) => group.worker.uuid === initialWorkerUuid)
            : undefined;

        const selectedGroup = initialWorkerGroup ?? workerGroups[0];

        const firstOption = selectedGroup?.options[0];

        if (!selectedGroup || !firstOption) {
            return;
        }

        form.setValue('scheduledStartAtUTC', firstOption.scheduledStartAtUTC, {
            shouldDirty: false,
            shouldValidate: true,
        });

        onAppointmentWorkerChange?.(selectedGroup.worker.uuid);

        setExpandedWorkerUuid(selectedGroup.worker.uuid);
    }, [
        timeType,
        options,
        workerGroups,
        scheduledStartAtUTC,
        initialWorkerUuid,
        form,
        onAppointmentWorkerChange,
    ]);

    const handleSelect = (option: SchedulingOption, selectedWorkerUuid: string) => {
        /*
         * In WORKER mode the worker and room are part of the form.
         */
        if (timeType === AppointmentTimeType.WORKER) {
            form.setValue('workerUuid', selectedWorkerUuid, {
                shouldDirty: true,
                shouldValidate: false,
            });

            form.setValue('roomUuid', option.room.uuid, {
                shouldDirty: true,
                shouldValidate: false,
            });

            onAppointmentWorkerChange?.(selectedWorkerUuid);
        }

        /*
         * In NEAREST mode workerUuid and roomUuid stay out of the
         * scheduling form.
         *
         * The worker is instead retained by the parent for the
         * eventual appointment creation request.
         */
        if (timeType === AppointmentTimeType.NEAREST) {
            onAppointmentWorkerChange?.(selectedWorkerUuid);
        }

        form.setValue('scheduledStartAtUTC', option.scheduledStartAtUTC, {
            shouldDirty: true,
            shouldValidate: false,
        });

        setExpandedWorkerUuid(selectedWorkerUuid);

        form.clearErrors('scheduledStartAtUTC');

        if (timeType === AppointmentTimeType.WORKER) {
            form.clearErrors('workerUuid');
            form.clearErrors('roomUuid');
        }

        void form.trigger(
            timeType === AppointmentTimeType.WORKER
                ? ['workerUuid', 'roomUuid', 'scheduledStartAtUTC']
                : ['scheduledStartAtUTC'],
        );
    };

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
                    Select a start time to find available appointments.
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
