import { Role } from './enums/roles.js';
import { z } from 'zod';
import { ActivationStatus } from './enums/activation-status.js';
import {
    createUserSchema,
    inviteUserSchema,
    loginUserSchema,
    queryUserSchema,
    registerUserSchema,
    updateUserByAdminSchema,
    updateUserSchema,
    userFilterSchema,
} from '../zod-schemas/user.schema.js';
import type { DataResponses, Filter } from './Query/query.model.ts';
import { Order } from './enums/order.js';

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

export type CreateUser = z.infer<typeof createUserSchema>;
export type InviteUser = z.infer<typeof inviteUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema> & { uuid: string };
export type UpdateUserByAdminForm = z.infer<typeof updateUserByAdminSchema>;
export type UpdateUserByAdmin = UpdateUserByAdminForm & { uuid: string };
export type QueryUser = z.infer<typeof queryUserSchema>;
export type LoginForm = z.infer<typeof loginUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
