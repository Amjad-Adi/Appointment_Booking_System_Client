import { useEffect, useMemo, useState } from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';

import { AppointmentTimeType } from '../../../../models/enums/appointment-time-type.ts';
import { useOrganizationScheduling } from '../../hooks/scheduling-hook.ts';
import type { SchedulingOption } from '../../../../models/scheduling.model.ts';
import { schedulingSchema } from '../../../../zod-schemas/scheduling.schema.ts';
import type { CreateAppointmentFormInput } from '../../../../zod-schemas/appointment.schema.ts';

import { z } from 'zod';

type SchedulingRequest = z.input<typeof schedulingSchema>;

interface AppointmentAvailabilityProps {
    organizationUuid?: string;
    selectedDate?: Date;
    selectedTime?: Date;
    selectedWorkerUuid?: string;
    form: UseFormReturn<CreateAppointmentFormInput>;
}

function getDefaultStart(selectedDate?: Date, selectedTime?: Date): string {
    return (selectedTime ?? selectedDate ?? new Date()).toISOString();
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

export function AppointmentAvailability({
    organizationUuid,
    selectedDate,
    selectedTime,
    selectedWorkerUuid,
    form,
}: AppointmentAvailabilityProps) {
    const [selectedOption, setSelectedOption] = useState<SchedulingOption>();

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

    const workerModeStart = useMemo(
        () => getDefaultStart(selectedDate, selectedTime),
        [selectedDate, selectedTime],
    );

    useEffect(() => {
        if (timeType !== AppointmentTimeType.WORKER) {
            return;
        }

        if (selectedWorkerUuid && workerUuid !== selectedWorkerUuid) {
            form.setValue('workerUuid', selectedWorkerUuid, {
                shouldDirty: false,
                shouldValidate: true,
            });
        }
    }, [selectedWorkerUuid, timeType, workerUuid, form]);

    /*
     * WORKER:
     *   Calendar-selected time
     *
     * NEAREST:
     *   User-entered start time
     */
    const searchStartAtUTC = timeType === AppointmentTimeType.NEAREST ? fromAtUTC : workerModeStart;

    /*
     * Only send workerUuid to the scheduling
     * endpoint when using WORKER mode.
     */
    const schedulingWorkerUuid =
        timeType === AppointmentTimeType.WORKER ? workerUuid || undefined : undefined;

    const schedulingRequest = useMemo<SchedulingRequest | undefined>(() => {
        if (!userUuid || !serviceUuid || !timeType || !searchStartAtUTC) {
            return undefined;
        }

        if (timeType === AppointmentTimeType.WORKER && !schedulingWorkerUuid) {
            return undefined;
        }

        const request: SchedulingRequest = {
            userUuid,
            serviceUuid,
            timeType,
            fromAtUTC: searchStartAtUTC,
        };

        if (timeType === AppointmentTimeType.WORKER && schedulingWorkerUuid) {
            request.workerUuid = schedulingWorkerUuid;
        }

        return request;
    }, [userUuid, serviceUuid, timeType, schedulingWorkerUuid, searchStartAtUTC]);

    const { data, isLoading, isFetching, isError } = useOrganizationScheduling(
        organizationUuid,
        schedulingRequest,
    );

    const options = data?.options ?? [];

    /*
     * Clear the currently selected appointment
     * whenever the scheduling criteria change.
     */
    useEffect(() => {
        setSelectedOption(undefined);

        form.setValue('scheduledStartAtUTC', '', {
            shouldDirty: false,
            shouldValidate: false,
        });
    }, [userUuid, serviceUuid, timeType, schedulingWorkerUuid, searchStartAtUTC, form]);

    /*
     * Automatically select the first available option.
     */
    useEffect(() => {
        if (options.length === 0) {
            return;
        }

        if (
            selectedOption &&
            options.some(
                (option) =>
                    option.worker.uuid === selectedOption.worker.uuid &&
                    option.room.uuid === selectedOption.room.uuid &&
                    option.scheduledStartAtUTC === selectedOption.scheduledStartAtUTC,
            )
        ) {
            return;
        }

        const firstOption = options[0];

        setSelectedOption(firstOption);

        /*
         * In NEAREST mode the scheduling endpoint
         * determines the worker.
         *
         * In WORKER mode this keeps the selected
         * worker synchronized.
         */
        form.setValue('workerUuid', firstOption.worker.uuid, {
            shouldDirty: false,
            shouldValidate: true,
        });

        form.setValue('scheduledStartAtUTC', firstOption.scheduledStartAtUTC, {
            shouldDirty: false,
            shouldValidate: true,
        });
    }, [options, selectedOption, form]);

    const handleSelect = (option: SchedulingOption) => {
        setSelectedOption(option);

        form.setValue('workerUuid', option.worker.uuid, {
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

    if (options.length === 0) {
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

                <span className="text-[9px] text-[#777789]">{options.length} available</span>
            </div>

            <div className="flex flex-col gap-1.5">
                {options.map((option) => {
                    const selected =
                        selectedOption?.scheduledStartAtUTC === option.scheduledStartAtUTC &&
                        selectedOption?.worker.uuid === option.worker.uuid &&
                        selectedOption?.room.uuid === option.room.uuid;

                    return (
                        <button
                            key={`${option.worker.uuid}-${option.room.uuid}-${option.scheduledStartAtUTC}`}
                            type="button"
                            onClick={() => handleSelect(option)}
                            className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                                selected
                                    ? 'border-[#343447] bg-[#ededf2]'
                                    : 'border-[#d3d3df] bg-[#f5f5f8] hover:bg-[#ededf2]'
                            }`}
                        >
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#d3d3df]">
                                <span className="text-[10px] font-semibold text-[#343447]">
                                    {option.worker.firstName.charAt(0).toUpperCase()}
                                </span>
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
                                    {option.worker.firstName} {option.worker.lastName}
                                    {' · '}
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
