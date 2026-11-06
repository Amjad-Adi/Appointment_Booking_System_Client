import { z } from 'zod';

import {
    createReviewSchema,
    queryReviewSchema,
    updateReviewSchema,
} from '../zod-schemas/review.schema';
import { DataResponses } from './Query/query.model.ts';

export interface Review {
    uuid: string;
    rating: number;
    comment: string;
    createdAtUTC: string;
    updatedAtUTC: string;
}

export interface ReviewResponse extends Review, DataResponses {
    customerUuid: string;
    customerFirstName: string;
    customerLastName: string;
    customerProfilePicturePath: string | null;
    appointmentUuid: string;
    scheduledStartAtUTC: string;
    serviceUuid: string;
    serviceName: string;
    organizationUuid: string;
    organizationName: string;
}

export type CreateReview = z.infer<typeof createReviewSchema>;
export type UpdateReview = z.infer<typeof updateReviewSchema> & { uuid: string };
export type QueryReview = z.infer<typeof queryReviewSchema> & { offset?: number };
