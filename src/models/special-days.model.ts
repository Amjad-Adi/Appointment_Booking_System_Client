import { z } from 'zod';
import { ActivationStatus } from './enums/activation-status';
import {
    createSpecialDaySchema,
    querySpecialDaySchema,
    updateSpecialDaySchema,
} from '../zod-schemas/special-days.schema';
import { DataResponses } from './Query/query.model.ts';

export interface SpecialDay {
    uuid: string;
    name: string;
    description: string | null;
    dayDate: string;
    createdAtUTC: string;
    updatedAtUTC: string;
    status: ActivationStatus;
}

export interface SpecialDayResponse extends SpecialDay, DataResponses {
    organizationUuid: string;
    organizationName: string;
}

export type CreateSpecialDay = z.infer<typeof createSpecialDaySchema>;

export type UpdateSpecialDay = z.infer<typeof updateSpecialDaySchema> & {
    uuid: string;
};

export type QuerySpecialDay = z.infer<typeof querySpecialDaySchema> & { offset?: number };