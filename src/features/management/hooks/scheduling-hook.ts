import { useQuery } from '@tanstack/react-query';

import type { SchedulingRequest, SchedulingResponse } from '../../../models/scheduling.model.ts';

import { AppointmentTimeType } from '../../../models/enums/appointment-time-type.ts';
import { ORGANIZATION_SCHEDULING } from '../../../utlis/query-keys.ts';
import { api } from '../../../services/axios.ts';

function datetimeLocalToUTC(value: string): string {
    return new Date(value).toISOString();
}

function buildSchedulingPayload(request: SchedulingRequest) {
    if (request.timeType === AppointmentTimeType.WORKER) {
        return {
            userUuid: request.userUuid,
            serviceUuid: request.serviceUuid,
            timeType: request.timeType,
            workerUuid: request.workerUuid,
        };
    }

    return {
        userUuid: request.userUuid,
        serviceUuid: request.serviceUuid,
        timeType: request.timeType,
        fromAtUTC: request.fromAtUTC,
    };
}
export function useOrganizationScheduling(
    organizationUuid: string | undefined,
    request: SchedulingRequest | undefined,
) {
    const isRequestReady =
        !!organizationUuid &&
        !!request?.userUuid &&
        !!request?.serviceUuid &&
        (request.timeType === AppointmentTimeType.WORKER
            ? !!request.workerUuid
            : request.timeType === AppointmentTimeType.NEAREST
              ? !!request.fromAtUTC
              : false);

    return useQuery({
        queryKey: [ORGANIZATION_SCHEDULING, organizationUuid, request],

        queryFn: async (): Promise<SchedulingResponse> => {
            if (!organizationUuid) {
                throw new Error('Organization UUID is required');
            }

            if (!request) {
                throw new Error('Scheduling request is required');
            }

            const payload = buildSchedulingPayload(request);

            const response = await api.post<SchedulingResponse>(
                `/api/organizations/${organizationUuid}/scheduling`,
                payload,
            );

            return response.data;
        },
        enabled: isRequestReady,
    });
}
