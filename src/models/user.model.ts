import { Role } from './enums/roles';
import { z } from 'zod';
import { ActivationStatus } from './enums/activation-status';
import {
    loginFormSchema,
    registerUserSchema,
    queryUserSchema,
    updateUserByAdminSchema,
    updateUserPasswordSchema,
    updateUserSchema,
    userFilterSchema,
    createUserSchema,
    queryOrganizationCustomerSchema,
} from '../zod-schemas/user.schema';
import { DataResponses } from './Query/query.model.ts';

export interface User {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicturePath: string;
    createdAtUTC: Date;
    updatedAtUTC: Date;
    language: string;
    role: Role;
    status: ActivationStatus;
}

export interface UserResponse extends User, DataResponses {
    organizationUuid: string;
}

export interface OrganizationCustomer {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicturePath: string;
    isLinked: boolean;
    appointmentsCount: number;
    status: ActivationStatus;
    createdAtUTC: Date;
}

type UpdateUserFields = {
    role?: Role;
    status?: ActivationStatus;
    firstName?: string;
    lastName?: string;
    language?: string;
    profilePicturePath?: string;
    profilePictureId?: string;
};

export type LoginForm = z.infer<typeof loginFormSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema> & {
    uid: string;
    profilePicturePath?: string;
    profilePictureId?: string;
};
export type CreateUser = z.infer<typeof createUserSchema>;
export type CreateUserByAdmin = z.infer<typeof createUserSchema> & {
    profilePicture?: File | null;
};
export type UpdateUserByAdmin = z.infer<typeof updateUserByAdminSchema> & {
    uuid: string;
    profilePicture?: File | null;
};
export type UpdateUserByAdminForm = z.infer<typeof updateUserByAdminSchema>;
export type UpdateCurrentUser = z.infer<typeof updateUserSchema> & {
    uuid: string;
    profilePicturePath?: string;
    profilePictureId?: string;
};
const combinedUpdateUserSchema = updateUserSchema.extend(updateUserByAdminSchema.shape);
export type UpdateUser = z.infer<typeof combinedUpdateUserSchema> & {
    uuid: string;
    profilePicturePath?: string;
    profilePictureId?: string;
};
export type UpdateCurrentUserPassword = z.infer<typeof updateUserPasswordSchema> & { uid: string };
export type QueryUser = z.infer<typeof queryUserSchema> & { offset?: number };
export type QueryOrganizationCustomer = z.infer<typeof queryOrganizationCustomerSchema> & {
    offset?: number;
};
