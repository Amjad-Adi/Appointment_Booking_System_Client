import { z } from 'zod';

import { ActivationStatus } from './enums/activation-status';

import {
    createServiceSchema,
    queryServiceSchema,
    updateServiceSchema,
} from '../zod-schemas/service.schema';

import { DataResponses } from './Query/query.model.ts';
import type { ServiceCategory } from './service-category.model.ts';

export interface ServiceCategorySummary {
    uuid: string;
    name: string;
    description: string;
    picturePath?: string | null;
}

export interface Service {
    uuid: string;
    name: string;
    description: string;
    price: number;
    durationInMinutes: number;
    servicePicturePath: string;
    createdAtUTC: string;
    updatedAtUTC: string;
    status: ActivationStatus;
}

export interface ServiceResponse extends Service, DataResponses {
    organizationUuid: string;
    organizationName: string;
    profilePicturePath: string;
    categories: ServiceCategorySummary[];
    isFavourite: boolean;
    averageRating: number;
    reviewCount: number;
}

export type CreateService = z.infer<typeof createServiceSchema> & {
    organizationUuid: string;
    servicePicturePath?: string;
    servicePicturePathId?: string;
};

export type UpdateService = z.infer<typeof updateServiceSchema> & {
    uuid: string;
    organizationUuid: string;
    userUuid: string;
    servicePicturePath?: string;
    servicePicturePathId?: string;
};

export type QueryService = z.infer<typeof queryServiceSchema> & {
    offset?: number;
};
