import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';

import { useAddFavourite, useRemoveFavourite } from '../hooks/favourite-hook.ts';
import { getApiErrorMessage } from '../../../utlis/api-error.ts';

interface FavouriteButtonProps {
    serviceUuid: string;
    isFavourite: boolean;
    className?: string;
}

export function FavouriteButton({ serviceUuid, isFavourite, className }: FavouriteButtonProps) {
    const addMutation = useAddFavourite();
    const removeMutation = useRemoveFavourite();

    const isPending = addMutation.isPending || removeMutation.isPending;

    const handleToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        try {
            await toast.promise(
                isFavourite
                    ? removeMutation.mutateAsync(serviceUuid)
                    : addMutation.mutateAsync(serviceUuid),
                {
                    loading: isFavourite ? 'Removing favourite...' : 'Adding favourite...',
                    success: isFavourite ? 'Removed from favourites' : 'Added to favourites',
                    error: (mutationError) =>
                        getApiErrorMessage(mutationError, 'Failed to update favourite'),
                },
            );
        } catch {
            // Error is surfaced by toast.promise.
        }
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
            aria-pressed={isFavourite}
            className={twMerge(
                'inline-flex size-8 shrink-0 items-center justify-center rounded-full border shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                isFavourite
                    ? 'border-destructive-border bg-destructive-soft text-destructive'
                    : 'border-border bg-popover/95 text-muted-foreground hover:text-destructive',
                className,
            )}
        >
            <Heart
                className="size-4"
                strokeWidth={1.8}
                fill={isFavourite ? 'currentColor' : 'none'}
            />
        </button>
    );
}
