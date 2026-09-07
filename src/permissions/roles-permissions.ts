import { USER_MANAGEMENT_PAGE, ORGANIZATION_INVITATION_PAGE, HAS_LOGIN } from './permissions.js';
import { Role } from '../models/enums/roles.js';
const customerPermissions: string[] = [HAS_LOGIN];

const workerPermissions: string[] = [...customerPermissions];

const crmPermissions: string[] = [...workerPermissions];

const managerPermissions: string[] = [...crmPermissions, ORGANIZATION_INVITATION_PAGE];

const ownerPermissions: string[] = [...managerPermissions];

const superAdminPermissions: string[] = [...ownerPermissions, USER_MANAGEMENT_PAGE];
export const rolesPermissions: Record<Role, string[]> = {
    [Role.SUPER_ADMIN]: superAdminPermissions,
    [Role.OWNER]: ownerPermissions,
    [Role.MANAGER]: managerPermissions,
    [Role.CRM]: crmPermissions,
    [Role.WORKER]: workerPermissions,
    [Role.CUSTOMER]: customerPermissions,
};
