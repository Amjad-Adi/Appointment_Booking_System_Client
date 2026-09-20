import { z } from 'zod';
import { ActivationStatus } from './enums/activation-status.js';
import {
    createServiceSchema,
    queryServiceSchema,
    updateServiceSchema,
} from '../zod-schemas/service.schema.js';
import type { DataResponses } from './Query/query.model.ts';
import type { ServiceCategory } from './service-category.model.ts';

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
    categories: ServiceCategory[];
}

export type OrganizationServiceResponseService = Service;
export type CreateService = z.infer<typeof createServiceSchema>;
export type UpdateService = z.infer<typeof updateServiceSchema>;
export type QueryService = z.infer<typeof queryServiceSchema>;
