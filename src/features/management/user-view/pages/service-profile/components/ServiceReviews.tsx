import { useState } from 'react';
import { ChevronLeft, ChevronRight, MessageSquareText, UserRound } from 'lucide-react';

import { Button } from '../../../../../../components/Button.tsx';
import { EntityImage } from '../../../../../../components/EntityImage.tsx';
import { Select } from '../../../../../../components/Select.tsx';
import { LoadingState } from '../../../../../../components/LoadingState.tsx';
import { ErrorState } from '../../../../../../components/ErrorState.tsx';
import { RatingStars } from '../../../../components/RatingStars.tsx';

import { useServiceReviews } from '../../../../hooks/review-hook.ts';

import { Order } from '../../../../../../models/enums/order.ts';

interface ServiceReviewsProps {
    serviceUuid: string;
    averageRating: number;
    reviewCount: number;
}

const REVIEWS_PAGE_SIZE = 5;

export function ServiceReviews({
    serviceUuid,
    averageRating,
    reviewCount,
}: ServiceReviewsProps) {
    const [page, setPage] = useState(1);
    const [rating, setRating] = useState<number | undefined>();

    const { data, isLoading, isError, error, refetch } = useServiceReviews(serviceUuid, {
        page,
        limit: REVIEWS_PAGE_SIZE,
        sortBy: 'createdAtUTC',
        order: Order.DESC,
        filter: rating ? { rating } : undefined,
    });

    const totalPages = data?.pagination?.totalPages ?? 0;

    return (
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-secondary">
                        <MessageSquareText className="size-4 text-muted-foreground" strokeWidth={1.8} />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-foreground">Reviews</h2>

                        <p className="text-[10px] text-muted-foreground">
                            What customers say about this service
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <RatingStars value={averageRating ?? 0} count={reviewCount} size="md" />

                    <Select
                        label="Rating"
                        isLabelDisabled
                        value={rating?.toString() ?? ''}
                        onChange={(event) => {
                            const value = event.target.value;
                            setRating(value === '' ? undefined : Number(value));
                            setPage(1);
                        }}
                        wrapperClassName="w-28"
                        className="!h-8 px-2 text-[11px]"
                    >
                        <option value="">All ratings</option>
                        {[5, 4, 3, 2, 1].map((value) => (
                            <option key={value} value={value}>
                                {value} stars
                            </option>
                        ))}
                    </Select>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                {isLoading ? (
                    <LoadingState label="Loading reviews..." rows={2} />
                ) : isError ? (
                    <ErrorState
                        error={error}
                        title="Failed to load reviews"
                        onRetry={() => {
                            void refetch();
                        }}
                    />
                ) : (data?.data?.length ?? 0) === 0 ? (
                    <p className="py-6 text-center text-[11px] text-muted-foreground">
                        No reviews yet.
                    </p>
                ) : (
                    data?.data.map((review) => (
                        <article
                            key={review.uuid}
                            className="rounded-lg border border-border bg-card p-3"
                        >
                            <div className="flex min-w-0 items-start justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-2">
                                    <EntityImage
                                        src={review.customerProfilePicturePath}
                                        alt={`${review.customerFirstName ?? ''} ${review.customerLastName ?? ''}`.trim()}
                                        icon={UserRound}
                                        className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground"
                                        iconClassName="size-4"
                                    />

                                    <div className="min-w-0">
                                        <p className="truncate text-[11px] font-semibold text-foreground">
                                            {review.customerFirstName} {review.customerLastName}
                                        </p>

                                        <p className="text-[9px] text-muted-foreground">
                                            {new Date(review.createdAtUTC).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <RatingStars value={review.rating} showValue={false} />
                            </div>

                            <p className="mt-2 text-[11px] leading-5 whitespace-pre-line text-secondary-foreground">
                                {review.comment}
                            </p>
                        </article>
                    ))
                )}
            </div>

            {totalPages > 1 ? (
                <div className="mt-3 flex items-center justify-end gap-1">
                    <Button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                        className="flex size-7 min-h-0 min-w-0 items-center justify-center border border-border-strong bg-transparent p-0 text-muted-foreground hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Previous reviews page"
                    >
                        <ChevronLeft className="size-4" strokeWidth={2} />
                    </Button>

                    <span className="flex h-7 min-w-12 items-center justify-center text-[11px] font-semibold text-secondary-foreground">
                        {page} / {totalPages}
                    </span>

                    <Button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
                        className="flex size-7 min-h-0 min-w-0 items-center justify-center border border-border-strong bg-transparent p-0 text-muted-foreground hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Next reviews page"
                    >
                        <ChevronRight className="size-4" strokeWidth={2} />
                    </Button>
                </div>
            ) : null}
        </section>
    );
}
