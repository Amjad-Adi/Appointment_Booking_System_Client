import { Role } from '../enums/roles';

export const roleRecord: Record<Role, string> = {
    [Role.SUPER_ADMIN]: 'System Administrator',
    [Role.OWNER]: 'Business Owner',
    [Role.MANAGER]: 'Manager',
    [Role.CRM]: 'Sales & Support Representative',
    [Role.WORKER]: 'Staff Member',
    [Role.CUSTOMER]: 'Customer',
};
