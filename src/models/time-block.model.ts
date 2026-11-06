import { z } from 'zod';
import {
    createTimeBlockSchema,
    createTimeBlockSchemaByCrm,
    queryTimeBlockSchema,
    updateTimeBlockSchema,
} from '../zod-schemas/time-block.schema';
import { TimeBlockStatus } from './enums/time-block-status';
import { DataResponses } from './Query/query.model.ts';

export interface TimeBlock {
    uuid: string;
    reason: string | null;
    startAtUTC: string;
    endAtUTC: string;
    requestedAtUTC: string;
    respondedAtUTC: string | null;
    requestStatus: TimeBlockStatus;
}

export interface TimeBlockResponse extends TimeBlock, DataResponses {
    requestUserUuid: string;
    requestUserFirstName: string;
    requestUserLastName: string;
    requestUserProfilePicturePath: string | null;
    respondUserUuid: string | null;
    respondUserFirstName: string | null;
    respondUserLastName: string | null;
    respondUserProfilePicturePath: string | null;
}

export type CreateTimeBlock = z.infer<typeof createTimeBlockSchema>;

export type CreateTimeBlockByCrm = z.infer<typeof createTimeBlockSchemaByCrm>;

export type UpdateTimeBlock = z.infer<typeof updateTimeBlockSchema> & {
    uuid: string;
};

export type QueryTimeBlock = z.infer<typeof queryTimeBlockSchema> & { offset?: number };
