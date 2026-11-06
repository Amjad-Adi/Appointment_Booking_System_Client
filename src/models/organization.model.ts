import type { z } from 'zod';
import { ActivationStatus } from './enums/activation-status';
import {
    createOrganizationSchema,
    updateOrganizationSchema,
    updateOrganizationByAdminSchema,
    queryOrganizationSchema,
    createOrganizationByAdminSchema,
} from '../zod-schemas/organization.schema';
import type { LocationResponse } from './location.model';
import type { DataResponses } from './Query/query.model';

export interface Organization {
    uuid: string;
    name: string;
    email: string;
    phoneNumber: string;
    bio: string;
    locationId: number;
    profilePicturePath: string;
    createdAtUTC: string;
    updatedAtUTC: string;
    status: ActivationStatus;
}

export interface OrganizationResponse extends DataResponses {
    uuid: string;
    name: string;
    email: string;
    phoneNumber: string;
    bio: string;
    location: LocationResponse;
    profilePicturePath: string;
    createdAtUTC: string;
    updatedAtUTC: string;
    status: ActivationStatus;
}

export interface OrganizationRow {
    uuid: string;
    name: string;
    email: string;
    phoneNumber: string;
    bio: string;
    profilePicturePath: string;
    locationName: string | null;
    timezone: string;
    longitude: number | null;
    latitude: number | null;
    locationCreatedAtUTC: string | null;
    locationUpdatedAtUTC: string | null;
    createdAtUTC: string;
    updatedAtUTC: string;
    status: ActivationStatus;
}

export type CreateOrganization = z.infer<typeof createOrganizationSchema> & {
    profilePicturePath?: string;
    profilePictureId?: string;
};

export type UpdateOrganizationByUser = z.infer<typeof updateOrganizationSchema> & {
    uuid: string;
    userUuid: string;
    profilePicturePath?: string;
    profilePictureId?: string;
};

export type UpdateOrganizationByAdminForm = z.infer<typeof updateOrganizationByAdminSchema>;

export type UpdateOrganizationByAdmin = z.infer<typeof updateOrganizationByAdminSchema> & {
    uuid: string;
};

const combinedUpdateOrganizationSchema = updateOrganizationByAdminSchema
    .extend(updateOrganizationSchema.shape)
    .partial({ status: true });

export type UpdateOrganization = z.infer<typeof combinedUpdateOrganizationSchema> & {
    uuid: string;
    profilePicturePath?: string;
    profilePictureId?: string;
};

export type QueryOrganization = z.infer<typeof queryOrganizationSchema> & {
    offset?: number;
};

export type CreateOrganizationByAdmin = z.infer<typeof createOrganizationByAdminSchema>;
