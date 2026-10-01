import {
    ACCEPT_ORGANIZATION_INVITATION,
    ADD_FAVOURITE,
    CANCEL_OWN_APPOINTMENT,
    CREATE_APPOINTMENT,
    CREATE_ORGANIZATION,
    CREATE_ORGANIZATION_INVITATIONS,
    CREATE_REVIEW,
    CREATE_ROOM,
    CREATE_SERVICE,
    CREATE_SERVICE_CATEGORY,
    CRM_DASHBOARD_PAGE,
    CUSTOMER_DASHBOARD_PAGE,
    DELETE_OWN_REVIEW,
    DELETE_SERVICE,
    HAS_LOGIN,
    MANAGER_DASHBOARD_PAGE,
    ORGANIZATION_INVITATION_PAGE,
    ORGANIZATION_MANAGEMENT_PAGE,
    OWNER_DASHBOARD_PAGE,
    READ_ORGANIZATION_INVITATIONS,
    REJECT_ORGANIZATION_INVITATION,
    REMOVE_FAVOURITE,
    SUPER_ADMIN_ACCESS,
    SUPER_ADMIN_ORGANIZATIONS_MANAGEMENT_PAGE,
    SUPER_ADMIN_SERVICE_CATEGORIES_MANAGEMENT_PAGE,
    SUPER_ADMIN_USER_MANAGEMENT_PAGE,
    UPDATE_ORGANIZATION,
    UPDATE_ORGANIZATION_AS_ADMIN,
    UPDATE_OWN_APPOINTMENT,
    UPDATE_OWN_REVIEW,
    UPDATE_ROOM,
    UPDATE_SERVICE,
    USER_APPOINTMENTS_PAGE,
    USER_FAVOURITES_PAGE,
    USER_INVITATIONS_PAGE,
    USER_PROFILE_PAGE,
    USER_REVIEWS_PAGE,
    USER_ROOMS_PAGE,
    USER_SERVICES_PAGE,
    USER_SETTINGS_PAGE,
    VIEW_FAVOURITES,
    VIEW_OWN_APPOINTMENTS,
    VIEW_OWN_INVITATIONS,
    VIEW_REVIEWS,
    WORKER_DASHBOARD_PAGE,
    READ_USERS,
    CREATE_USER,
    UPDATE_USER_AS_ADMIN,
    SUPER_ADMIN_DASHBOARD_PAGE,
} from './permissions.ts';

import { Role } from '../models/enums/roles.ts';

// ==================================================
// Customer
// ==================================================

const customerPermissions: string[] = [
    HAS_LOGIN,

    CUSTOMER_DASHBOARD_PAGE,
    USER_SERVICES_PAGE,
    USER_APPOINTMENTS_PAGE,
    USER_FAVOURITES_PAGE,
    USER_REVIEWS_PAGE,
    USER_PROFILE_PAGE,
    USER_SETTINGS_PAGE,

    // Appointments
    CREATE_APPOINTMENT,
    VIEW_OWN_APPOINTMENTS,
    UPDATE_OWN_APPOINTMENT,
    CANCEL_OWN_APPOINTMENT,

    // Favourites
    VIEW_FAVOURITES,
    ADD_FAVOURITE,
    REMOVE_FAVOURITE,

    // Reviews
    VIEW_REVIEWS,
    CREATE_REVIEW,
    UPDATE_OWN_REVIEW,
    DELETE_OWN_REVIEW,

    // Organization invitations received by customer
    VIEW_OWN_INVITATIONS,
    ACCEPT_ORGANIZATION_INVITATION,
    REJECT_ORGANIZATION_INVITATION,
];

// ==================================================
// Worker
// ==================================================

const workerPermissions: string[] = [
    HAS_LOGIN,

    WORKER_DASHBOARD_PAGE,
    USER_SERVICES_PAGE,
    USER_APPOINTMENTS_PAGE,
    USER_ROOMS_PAGE,
    USER_PROFILE_PAGE,
    USER_SETTINGS_PAGE,
];

// ==================================================
// CRM
// ==================================================

const crmPermissions: string[] = [
    HAS_LOGIN,

    CRM_DASHBOARD_PAGE,
    ORGANIZATION_MANAGEMENT_PAGE,
    USER_INVITATIONS_PAGE,
    USER_SERVICES_PAGE,
    USER_APPOINTMENTS_PAGE,
    USER_ROOMS_PAGE,
    USER_PROFILE_PAGE,
    USER_SETTINGS_PAGE,

    ORGANIZATION_INVITATION_PAGE,
    READ_ORGANIZATION_INVITATIONS,
];

// ==================================================
// Manager
// ==================================================

const managerPermissions: string[] = [
    HAS_LOGIN,

    MANAGER_DASHBOARD_PAGE,
    ORGANIZATION_MANAGEMENT_PAGE,
    USER_SERVICES_PAGE,
    USER_APPOINTMENTS_PAGE,
    USER_ROOMS_PAGE,
    USER_PROFILE_PAGE,
    USER_SETTINGS_PAGE,
    USER_INVITATIONS_PAGE,

    // Organization invitations
    ORGANIZATION_INVITATION_PAGE,
    READ_ORGANIZATION_INVITATIONS,
    CREATE_ORGANIZATION_INVITATIONS,

    // Services
    CREATE_SERVICE,
    UPDATE_SERVICE,
    DELETE_SERVICE,

    // Rooms
    CREATE_ROOM,
    UPDATE_ROOM,
];

// ==================================================
// Owner
// ==================================================

const ownerPermissions: string[] = [
    HAS_LOGIN,

    OWNER_DASHBOARD_PAGE,
    ORGANIZATION_MANAGEMENT_PAGE,
    USER_SERVICES_PAGE,
    USER_APPOINTMENTS_PAGE,
    USER_ROOMS_PAGE,
    USER_PROFILE_PAGE,
    USER_SETTINGS_PAGE,
    USER_INVITATIONS_PAGE,

    // Organization invitations
    ORGANIZATION_INVITATION_PAGE,
    READ_ORGANIZATION_INVITATIONS,
    CREATE_ORGANIZATION_INVITATIONS,

    // Services
    CREATE_SERVICE,
    UPDATE_SERVICE,
    DELETE_SERVICE,

    // Rooms
    CREATE_ROOM,
    UPDATE_ROOM,

    // Organization
    CREATE_ORGANIZATION,
    UPDATE_ORGANIZATION,
];

// ==================================================
// Super Admin
// ==================================================

const superAdminPermissions: string[] = [
    HAS_LOGIN,
    SUPER_ADMIN_ACCESS,
SUPER_ADMIN_DASHBOARD_PAGE,
    // Super Admin pages
    SUPER_ADMIN_USER_MANAGEMENT_PAGE,
    SUPER_ADMIN_ORGANIZATIONS_MANAGEMENT_PAGE,
    SUPER_ADMIN_SERVICE_CATEGORIES_MANAGEMENT_PAGE,

    // Users
    READ_USERS,
    CREATE_USER,
    UPDATE_USER_AS_ADMIN,

    // Organizations
    UPDATE_ORGANIZATION_AS_ADMIN,

    // Service categories
    CREATE_SERVICE_CATEGORY,
];

// ==================================================
// Role -> Permissions
// ==================================================

export const rolesPermissions: Record<Role, string[]> = {
    [Role.SUPER_ADMIN]: superAdminPermissions,
    [Role.OWNER]: ownerPermissions,
    [Role.MANAGER]: managerPermissions,
    [Role.CRM]: crmPermissions,
    [Role.WORKER]: workerPermissions,
    [Role.CUSTOMER]: customerPermissions,
}