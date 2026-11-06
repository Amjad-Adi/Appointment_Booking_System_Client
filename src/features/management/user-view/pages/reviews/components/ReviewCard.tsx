import { BriefcaseBusiness, Building2, CalendarDays, Pencil, Trash2 } from 'lucide-react';

import type { ReviewResponse } from '../../../../../../models/review.model.ts';

import { Button } from '../../../../../../components/Button.tsx';
import { RatingStars } from '../../../../components/RatingStars.tsx';

interface ReviewCardProps {
    review: ReviewResponse;
    onEdit: (review: ReviewResponse) => void;
    onDelete: (review: ReviewResponse) => void;
    isDeleting?: boolean;
}

export function ReviewCard({ review, onEdit, onDelete, isDeleting = false }: ReviewCardProps) {
    return (
        <article className="flex h-full min-w-0 flex-col rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <BriefcaseBusiness className="size-5" strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0">
                        <h3
                            className="truncate text-sm font-semibold text-foreground"
                            title={review.serviceName}
                        >
                            {review.serviceName}
                        </h3>

                        <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[10px] text-muted-foreground">
                            <Building2 className="size-3 shrink-0" strokeWidth={1.8} />
                            <span className="truncate">{review.organizationName}</span>
                        </div>
                    </div>
                </div>

                <RatingStars value={review.rating} showValue={false} />
            </div>

            <p className="mt-3 line-clamp-4 text-[11px] leading-5 whitespace-pre-line text-secondary-foreground">
                {review.comment}
            </p>

            <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
                <span className="flex min-w-0 items-center gap-1.5 text-[10px] text-muted-foreground">
                    <CalendarDays className="size-3.5 shrink-0" strokeWidth={1.8} />
                    <span className="truncate">
                        {new Date(review.createdAtUTC).toLocaleDateString()}
                    </span>
                </span>

                <div className="flex shrink-0 items-center gap-1">
                    <Button
                        type="button"
                        onClick={() => onEdit(review)}
                        aria-label="Edit review"
                        className="flex size-7 min-h-0 min-w-0 items-center justify-center border border-transparent bg-transparent p-0 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                        <Pencil className="size-3.5" strokeWidth={1.8} />
                    </Button>

                    <Button
                        type="button"
                        onClick={() => onDelete(review)}
                        aria-label="Delete review"
                        disabled={isDeleting}
                        className="flex size-7 min-h-0 min-w-0 items-center justify-center border border-transparent bg-transparent p-0 text-destructive hover:bg-destructive-soft disabled:opacity-50"
                    >
                        <Trash2 className="size-3.5" strokeWidth={1.8} />
                    </Button>
                </div>
            </div>
        </article>
    );
}
