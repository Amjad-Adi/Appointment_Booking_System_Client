import { z } from 'zod';
import { ActivationStatus } from './enums/activation-status.js';
import {
    serviceFilterSchema,
    createServiceSchema,
    queryServiceSchema,
    updateServiceSchema,
} from '../zod-schemas/service.schema.js';
import type { DataResponses } from './Query/query.model.ts';
export interface Service {
    uuid: string;
    name: string;
    description: string;
    price: number;
    durationInMinutes: number;
    servicePicturePath: string;
    createdAtUTC: Date;
    updatedAtUTC: Date;
    status: ActivationStatus;
}

export interface ServiceResponse extends Service, DataResponses {
    organizationUuid: string;
    organizationName: string;
    profilePicturePath: string;
}

export type CreateService = z.infer<typeof createServiceSchema> & {
    organizationUuid: string;
    organizationId: number;
};
export type UpdateService = z.infer<typeof updateServiceSchema> & {
    uuid: string;
    organizationUuid: string;
    userUuid: string;
};
export type QueryService = z.infer<typeof queryServiceSchema> & { offset: number };
