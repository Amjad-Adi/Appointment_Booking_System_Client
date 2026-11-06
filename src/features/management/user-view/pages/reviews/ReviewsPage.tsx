import { useState } from 'react';
import { type PaginationState } from '@tanstack/react-table';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { ManagementPage } from '../../../components/ManagementPage.tsx';
import { BoardView } from '../../../../../components/BoardView.tsx';
import { ErrorState } from '../../../../../components/ErrorState.tsx';
import { PAGE_SIZE } from '../../../../../components/DataTableFeatures.ts';
import {
    CreateDialog,
    type CreateDialogField,
} from '../../../../../components/CreateDialog.tsx';

import { useDeleteReview, useReviews, useUpdateReview } from '../../../hooks/review-hook.ts';

import type { ReviewResponse } from '../../../../../models/review.model.ts';

import { getApiErrorMessage } from '../../../../../utlis/api-error.ts';

import { ReviewCard } from './components/ReviewCard.tsx';

const editReviewFormSchema = z.object({
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().trim().min(3).max(4096),
});

type EditReviewForm = z.output<typeof editReviewFormSchema>;
type EditReviewFormInput = z.input<typeof editReviewFormSchema>;

export function ReviewsPage() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState<ReviewResponse | undefined>();

    const updateMutation = useUpdateReview();
    const deleteMutation = useDeleteReview();

    const { data, isLoading, isError, error, refetch } = useReviews({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: search || undefined,
    });

    const resetPage = () => {
        setPagination((previous) => ({ ...previous, pageIndex: 0 }));
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        resetPage();
    };

    const handleDelete = async (review: ReviewResponse) => {
        if (!window.confirm('Delete this review?')) {
            return;
        }

        try {
            await toast.promise(deleteMutation.mutateAsync(review.uuid), {
                loading: 'Deleting review...',
                success: 'Review deleted',
                error: (mutationError) =>
                    getApiErrorMessage(mutationError, 'Failed to delete review'),
            });
        } catch {
            // Error is surfaced by toast.promise.
        }
    };

    const fields: CreateDialogField<EditReviewFormInput>[] = [
        {
            name: 'rating',
            label: 'Rating',
            type: 'select',
            options: [5, 4, 3, 2, 1].map((value) => ({
                value: value.toString(),
                label: `${value} star${value === 1 ? '' : 's'}`,
            })),
        },
        {
            name: 'comment',
            label: 'Comment',
            type: 'custom',
            render: (form) => (
                <div className="flex flex-col">
                    <label
                        htmlFor="review_comment"
                        className="mb-1.5 text-[11px] font-medium text-foreground"
                    >
                        Comment
                    </label>

                    <textarea
                        id="review_comment"
                        rows={4}
                        placeholder="Share your experience"
                        className="w-full resize-y rounded-lg border border-border bg-card p-2.5 text-[11px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
                        {...form.register('comment')}
                    />
                </div>
            ),
        },
    ];

    if (isError) {
        return (
            <ManagementPage
                title="My Reviews"
                description={['Manage the reviews you left for completed appointments.']}
            >
                <ErrorState
                    error={error}
                    title="Failed to load reviews"
                    onRetry={() => refetch()}
                />
            </ManagementPage>
        );
    }

    return (
        <ManagementPage
            title="My Reviews"
            description={['Manage the reviews you left for completed appointments.']}
        >
            <BoardView<ReviewResponse>
                items={data?.data ?? []}
                getKey={(review) => review.uuid}
                renderItem={(review) => (
                    <ReviewCard
                        review={review}
                        onEdit={setEditing}
                        onDelete={handleDelete}
                        isDeleting={deleteMutation.isPending}
                    />
                )}
                search={search}
                onSearchChange={handleSearchChange}
                pagination={pagination}
                onPaginationChange={setPagination}
                rowCount={data?.pagination?.totalItems ?? 0}
                rowCountLabel={`${data?.pagination?.totalItems === 0 ? 'No' : (data?.pagination?.totalItems ?? 0)} Reviews`}
                isLoading={isLoading}
                emptyTitle="No reviews yet"
                emptyDescription="Reviews appear after completed appointments."
                gridClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
            />

            <CreateDialog<EditReviewFormInput, EditReviewForm>
                key={`edit-review-${editing?.uuid ?? 'none'}`}
                open={Boolean(editing)}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditing(undefined);
                    }
                }}
                title="Edit Review"
                description="Update your rating and comment."
                resolver={zodResolver(editReviewFormSchema)}
                defaultValues={{
                    rating: editing?.rating ?? 5,
                    comment: editing?.comment ?? '',
                }}
                fields={fields}
                submitLabel="Save Changes"
                onSubmit={async (values) => {
                    if (!editing) {
                        return;
                    }

                    try {
                        await toast.promise(
                            updateMutation.mutateAsync({
                                uuid: editing.uuid,
                                rating: Number(values.rating),
                                comment: values.comment,
                            }),
                            {
                                loading: 'Updating review...',
                                success: 'Review updated',
                                error: (mutationError) =>
                                    getApiErrorMessage(mutationError, 'Failed to update review'),
                            },
                        );

                        setEditing(undefined);
                    } catch {
                        // Error is surfaced by toast.promise.
                    }
                }}
            />
        </ManagementPage>
    );
}
