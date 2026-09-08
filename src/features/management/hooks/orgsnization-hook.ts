import { useQuery } from '@tanstack/react-query';
import { CURRENT_USER, ORGANIZATION } from '../../../utlis/query-keys.ts';
import type { UserResponse } from '../../../models/user.model.ts';
import { api } from '../../../services/axios.ts';
import type { OrganizationResponse } from '../../../models/organization.model.ts';

export function useOrganization(organizationUuid: string) {
    return useQuery({
        queryKey: [ORGANIZATION, organizationUuid],
        queryFn: async (): Promise<OrganizationResponse> => {
            const response = await api.get<OrganizationResponse>(
                `/api/organizations/${organizationUuid}`,
            );
            return response.data;
        },
    });
}
