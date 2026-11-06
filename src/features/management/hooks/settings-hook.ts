import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../services/axios.ts';
import type { UserSettings, UserSettingsForm } from '../../../models/user-settings.model.ts';
import { USER_SETTINGS } from '../../../utlis/query-keys.ts';

export function useUserSettings() {
    return useQuery({
        queryKey: [USER_SETTINGS],
        queryFn: async (): Promise<UserSettings> => {
            const response = await api.get<UserSettings>('/api/settings/me');
            return response.data;
        },
    });
}

export function useUpdateUserSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (settings: Partial<UserSettingsForm>): Promise<UserSettings> => {
            const response = await api.patch<UserSettings>('/api/settings/me', settings);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [USER_SETTINGS] });
        },
    });
}
