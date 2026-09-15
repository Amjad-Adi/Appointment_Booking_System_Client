import { z } from 'zod';

import { ActivationStatus } from './enums/activation-status.js';

import {
    createSpecialDaysSchema,
    updateSpecialDaysSchema,
} from '../zod-schemas/special-days.schema.js';

export interface SpecialDay {
    uuid: string;
    name: string;
    description: string | null;
    dayDate: string;
    createdAtUTC: string;
    updatedAtUTC: string;
    status: ActivationStatus;
}

export type CreateSpecialDay = z.infer<typeof createSpecialDaysSchema>;

export type UpdateSpecialDay = z.infer<typeof updateSpecialDaysSchema> & {
    uuid: string;
};
