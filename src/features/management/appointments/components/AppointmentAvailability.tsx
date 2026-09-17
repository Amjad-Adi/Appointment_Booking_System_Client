import { UserCircle } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { AppointmentTimeType } from '../../../../models/enums/appointment-time-type.ts';

import { useOrganizationScheduling } from '../../hooks/scheduling-hook.ts';

import type {
    SchedulingOption,
    SchedulingWorkerGroup,
} from '../../../../models/scheduling.model.ts';

import { schedulingSchema } from '../../../../zod-schemas/scheduling.schema.ts';

import type { CreateAppointmentFormInput } from '../../../../zod-schemas/appointment.schema.ts';

type SchedulingRequest = z.input<typeof schedulingSchema>;

interface AppointmentAvailabilityProps {
    organizationUuid?: string;
    form: UseFormReturn<CreateAppointmentFormInput>;
}

function getCurrentLocalDateTime(): string {
    const now = new Date();

    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16);
}

function formatTime(value: string) {
    return new Date(value).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
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
}: {
    group: SchedulingWorkerGroup;
    selectedOption?: SchedulingOption;
    onSelect: (option: SchedulingOption) => void;
}) {
    return (
        <div className="rounded-lg border border-[#d3d3df] bg-white">
            <div className="border-b border-[#d3d3df] bg-[#ededf2] px-3 py-2.5">
                <p className="text-[10px] font-semibold text-[#343447]">
                    {group.worker.firstName} {group.worker.lastName}
                </p>

                <p className="mt-0.5 text-[9px] text-[#777789]">
                    {group.options.length}{' '}
                    {group.options.length === 1 ? 'available time' : 'available times'}
                </p>
            </div>

            <div className="flex flex-col gap-1.5 p-2">
                {group.options.map((option) => {
                    const selected = isSameOption(selectedOption, option);

                    return (
                        <button
                            key={`${group.worker.uuid}-${option.room.uuid}-${option.scheduledStartAtUTC}`}
                            type="button"
                            onClick={() => onSelect(option)}
                            className={`group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                                selected
                                    ? 'border-[#343447] bg-[#ededf2]'
                                    : 'border-[#d3d3df] bg-[#f5f5f8] hover:bg-[#ededf2]'
                            }`}
                        >
                            <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#d3d3df]">
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full transition-colors ${
                                        selected
                                            ? 'bg-[#ededf2]'
                                            : 'bg-[#f5f5f8] group-hover:bg-[#ededf2]'
                                    }`}
                                >
                                    {group.worker.profilePicturePath === 'DEFAULT_PICTURE_PATH' ? (
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
                                        {formatDate(option.scheduledStartAtUTC)}
                                    </p>

                                    <span className="text-[9px] text-[#777789]">
                                        {formatTime(option.scheduledStartAtUTC)}
                                        {' – '}
                                        {formatTime(option.scheduledEndAtUTC)}
                                    </span>
                                </div>

                                <p className="mt-0.5 truncate text-[9px] text-[#777789]">
                                    {option.room.name}
                                </p>
                            </div>

                            <div
                                className={`flex size-4 shrink-0 items-center justify-center rounded-full border text-[9px] ${
                                    selected
                                        ? 'border-[#343447] bg-[#343447] text-white'
                                        : 'border-[#b9b9cc] text-transparent'
                                }`}
                            >
                                ✓
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export function AppointmentAvailability({
    organizationUuid,
    form,
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

    /*
     * Default scheduling mode is NEAREST.
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
     * NEAREST availability starts from the current
     * local date and time whenever the scheduling
     * criteria change.
     *
     * The form value stays in datetime-local format
     * so it can be displayed directly by the input.
     */
    useEffect(() => {
        if (timeType !== AppointmentTimeType.NEAREST) {
            return;
        }

        form.setValue('fromAtUTC', getCurrentLocalDateTime(), {
            shouldDirty: false,
            shouldValidate: true,
        });
    }, [timeType, userUuid, serviceUuid, form]);

    /*
     * WORKER availability searches from the current
     * time whenever the worker-related criteria change.
     */
    const workerModeStart = useMemo(
        () => new Date().toISOString(),
        [userUuid, serviceUuid, timeType, workerUuid],
    );

    /*
     * Keep the selected worker synchronized with the
     * worker selected outside this component.
     */
    /*
     * Normalize the local datetime input to a full
     * ISO UTC value before sending it to scheduling.
     *
     * Example:
     *
     * Form:
     *   2026-09-17T06:30
     *
     * Request:
     *   2026-09-17T03:30:00.000Z
     *
     * The form value itself remains local so the
     * datetime-local input displays correctly.
     */
    const searchStartAtUTC = useMemo(() => {
        if (timeType === AppointmentTimeType.NEAREST) {
            if (!fromAtUTC) {
                return undefined;
            }

            const date = new Date(fromAtUTC);

            if (Number.isNaN(date.getTime())) {
                return undefined;
            }

            return date.toISOString();
        }

        return workerModeStart;
    }, [timeType, fromAtUTC, workerModeStart]);

    const schedulingWorkerUuid =
        timeType === AppointmentTimeType.WORKER && workerUuid
            ? workerUuid
            : undefined;
    const schedulingRequest = useMemo<SchedulingRequest | undefined>(() => {
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
     * Find the selected option inside the currently
     * selected worker's group.
     */
    const selectedOption = useMemo(() => {
        if (!workerUuid || !scheduledStartAtUTC) {
            return undefined;
        }

        const workerGroup = workerGroups.find((group) => group.worker.uuid === workerUuid);

        return workerGroup?.options.find(
            (option) => option.scheduledStartAtUTC === scheduledStartAtUTC,
        );
    }, [workerGroups, workerUuid, scheduledStartAtUTC]);

    /*
     * Clear the selected appointment only when the
     * actual scheduling criteria change.
     *
     * IMPORTANT:
     *
     * `searchStartAtUTC` is intentionally NOT included.
     * Changing the search start time must not create a
     * secondary effect that wipes out the new selection.
     */
    useEffect(() => {
        form.setValue('scheduledStartAtUTC', '', {
            shouldDirty: false,
            shouldValidate: false,
        });
    }, [userUuid, serviceUuid, timeType, schedulingWorkerUuid, form]);

    /*
     * Automatically select the first available
     * appointment.
     *
     * In NEAREST mode this means the first option
     * returned by the backend becomes the default
     * appointment.
     */
    useEffect(() => {
         if (
             timeType !== AppointmentTimeType.NEAREST ||
             options.length === 0 ||
             scheduledStartAtUTC
         ) {
             return;
         }

         const firstOption = options[0];

         form.setValue('scheduledStartAtUTC', firstOption.scheduledStartAtUTC, {
             shouldDirty: false,
             shouldValidate: true,
         });
     }, [timeType, options, scheduledStartAtUTC, form]);

    const handleSelect = (option: SchedulingOption, workerUuid: string) => {
        form.setValue('workerUuid', workerUuid, {
            shouldDirty: true,
            shouldValidate: true,
        });

        form.setValue('scheduledStartAtUTC', option.scheduledStartAtUTC, {
            shouldDirty: true,
            shouldValidate: true,
        });
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
                        selectedOption={
                            group.worker.uuid === workerUuid ? selectedOption : undefined
                        }
                        onSelect={(option) => handleSelect(option, group.worker.uuid)}
                    />
                ))}
            </div>
        </div>
    );
}
