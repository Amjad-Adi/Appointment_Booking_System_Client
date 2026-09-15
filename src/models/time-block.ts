import type { z } from 'zod';

import {
    queryTimeBlockSchema,
    createTimeBlockSchema,
    updateTimeBlockSchema,
} from '../zod-schemas/time-block.schema.ts';
import type { TimeBlockStatus } from './enums/time-block-status.ts';

export interface TimeBlock {
    uuid: string;

    reason: string | null;

    startAtUTC: string;

    endAtUTC: string;

    requestedAtUTC: string;

    respondedAtUTC: string | null;

    requestStatus: TimeBlockStatus;
}

export interface TimeBlockResponse extends TimeBlock {
    requestUserUuid: string;
    requestUserFirstName: string;
    requestUserLastName: string;
    requestUserProfilePicturePath: string | null;

    respondUserUuid: string | null;
    respondUserFirstName: string | null;
    respondUserLastName: string | null;
    respondUserProfilePicturePath: string | null;
}
export type QueryTimeBlock = z.infer<typeof queryTimeBlockSchema>;

export type CreateTimeBlock = z.infer<typeof createTimeBlockSchema>;

export type UpdateTimeBlock = z.infer<typeof updateTimeBlockSchema> & {
    uuid: string;
};
