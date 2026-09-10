import {Role} from "./enums/roles.js";
import {z} from "zod"
import {ActivationStatus} from "./enums/activation-status.js";
import {
    createOrganizationSchema,
    updateOrganizationSchema,
    updateOrganizationByAdminSchema,
    queryOrganizationSchema,
} from '../zod-schemas/organization.schema.js';
import { createLocationSchema } from '../zod-schemas/location.schema.js';
import type { LocationResponse } from './location.model.js';
import { updateUserByAdminSchema } from '../zod-schemas/user.schema.ts';
export interface Organization {
    uuid:string,
    name:string
    email:string,
    phoneNumber:string,
    bio:string,
    locationId:number,
    profilePicturePath:string,
    createdAtUTC:Date,
    updatedAtUTC:Date,
    status:ActivationStatus
}
export interface OrganizationResponse{
    uuid:string,
    name:string
    email:string,
    phoneNumber:string,
    bio:string,
    location:LocationResponse,
    profilePicturePath:string,
    createdAtUTC:Date,
    updatedAtUTC:Date,
    status:ActivationStatus
}
export interface OrganizationRow {
    uuid: string;
    name: string;
    email: string;
    phoneNumber: string;
    bio: string;
    profilePicturePath: string;
    locationName: string|null;
    longitude: number|null;
    latitude: number|null;
    locationCreatedAtUTC: Date|null;
    locationUpdatedAtUTC: Date|null;
    createdAtUTC: Date;
    updatedAtUTC: Date;
    status: ActivationStatus;
}
export type CreateOrganization= z.infer<typeof createOrganizationSchema> & {organizationOwnerUuid:string};
export type UpdateOrganization= z.infer<typeof updateOrganizationSchema> & {uuid:string ,userUuid:string};
export type UpdateUserByAdminForm = z.infer<typeof updateUserByAdminSchema>;
export type UpdateUserByAdmin = UpdateUserByAdminForm & { uuid: string };
export type QueryOrganization = z.infer<typeof queryOrganizationSchema>
