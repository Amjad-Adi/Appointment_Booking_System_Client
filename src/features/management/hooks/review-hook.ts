import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
    type QueryClient,
} from '@tanstack/react-query';

import { api } from '../../../services/axios.ts';
import type { QueryResponse } from '../../../models/Query/query.model.ts';
import type {
    CreateReview,
    QueryReview,
    ReviewResponse,
    UpdateReview,
} from '../../../models/review.model.ts';
import {
    ORGANIZATION_REVIEWS,
    REVIEW,
    REVIEWS,
    SERVICE,
    SERVICE_REVIEWS,
} from '../../../utlis/query-keys.ts';
import { useDebouncedQuery } from '../../../hooks/deounce.ts';

export function useReviews(query: QueryReview, enabled = true) {
    const debouncedQuery = useDebouncedQuery(query);

    return useQuery({
        queryKey: [REVIEWS, debouncedQuery],
        queryFn: async (): Promise<QueryResponse<ReviewResponse>> => {
            const response = await api.get<QueryResponse<ReviewResponse>>('/api/reviews', {
                params: debouncedQuery,
            });

            return response.data;
        },
        enabled,
        placeholderData: keepPreviousData,
    });
}

export function useServiceReviews(serviceUuid: string | undefined, query: QueryReview) {
    const debouncedQuery = useDebouncedQuery(query);

    return useQuery({
        queryKey: [SERVICE_REVIEWS, serviceUuid, debouncedQuery],
        queryFn: async (): Promise<QueryResponse<ReviewResponse>> => {
            const response = await api.get<QueryResponse<ReviewResponse>>(
                `/api/services/${serviceUuid}/reviews`,
                { params: debouncedQuery },
            );

            return response.data;
        },
        enabled: !!serviceUuid,
        placeholderData: keepPreviousData,
    });
}

export function useOrganizationReviews(organizationUuid: string | undefined, query: QueryReview) {
    const debouncedQuery = useDebouncedQuery(query);

    return useQuery({
        queryKey: [ORGANIZATION_REVIEWS, organizationUuid, debouncedQuery],
        queryFn: async (): Promise<QueryResponse<ReviewResponse>> => {
            const response = await api.get<QueryResponse<ReviewResponse>>(
                `/api/organizations/${organizationUuid}/reviews`,
                { params: debouncedQuery },
            );

            return response.data;
        },
        enabled: !!organizationUuid,
        placeholderData: keepPreviousData,
    });
}

function invalidateReviewQueries(
    queryClient: QueryClient,
    review?: Pick<ReviewResponse, 'serviceUuid' | 'organizationUuid'>,
) {
    return Promise.all([
        queryClient.invalidateQueries({ queryKey: [REVIEWS] }),
        queryClient.invalidateQueries({ queryKey: [REVIEW] }),
        queryClient.invalidateQueries({ queryKey: [SERVICE_REVIEWS] }),
        queryClient.invalidateQueries({ queryKey: [ORGANIZATION_REVIEWS] }),
        review
            ? queryClient.invalidateQueries({ queryKey: [SERVICE, review.serviceUuid] })
            : Promise.resolve(),
    ]);
}

export function useCreateReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (review: CreateReview): Promise<ReviewResponse> => {
            const response = await api.post<ReviewResponse>('/api/reviews', review);
            return response.data;
        },
        onSuccess: async () => {
            await invalidateReviewQueries(queryClient);
        },
    });
}

export function useUpdateReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ uuid, ...review }: UpdateReview): Promise<ReviewResponse> => {
            const response = await api.patch<ReviewResponse>(`/api/reviews/${uuid}`, review);
            return response.data;
        },
        onSuccess: async () => {
            await invalidateReviewQueries(queryClient);
        },
    });
}

export function useDeleteReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (reviewUuid: string) => {
            await api.delete(`/api/reviews/${reviewUuid}`);
        },
        onSuccess: async () => {
            await invalidateReviewQueries(queryClient);
        },
    });
}
