import { z } from 'zod';

import { ActivationStatus } from './enums/activation-status';

import {
    createServiceCategorySchema,
    queryServiceCategorySchema,
    updateServiceCategorySchema,
} from '../zod-schemas/service-categoty.schema';

import { DataResponses } from './Query/query.model.ts';

export interface ServiceCategory {
    uuid: string;
    name: string;
    description?: string;
    picturePath: string;
    createdAtUTC: string;
    updatedAtUTC: string;
    status: ActivationStatus;
}

export interface ServiceCategoryResponse extends ServiceCategory, DataResponses {}

export type CreateServiceCategory = z.infer<typeof createServiceCategorySchema> & {
    picturePath?: string;
    picturePathId?: string;
};

export type UpdateServiceCategory = z.infer<typeof updateServiceCategorySchema> & {
    uuid: string;
    picturePath?: string;
    picturePathId?: string;
};

export type QueryServiceCategory = z.infer<typeof queryServiceCategorySchema> & {
    offset?: number;
};
