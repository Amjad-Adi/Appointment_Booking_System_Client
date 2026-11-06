import { Star } from 'lucide-react';

interface RatingStarsProps {
    value: number;
    count?: number;
    size?: 'sm' | 'md';
    showValue?: boolean;
}

export function RatingStars({ value, count, size = 'sm', showValue = true }: RatingStarsProps) {
    const roundedValue = Math.round(value);

    return (
        <div className="flex items-center gap-1 text-rating">
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, index) => (
                    <Star
                        key={index}
                        className={size === 'md' ? 'size-4' : 'size-3'}
                        strokeWidth={1.8}
                        fill={index < roundedValue ? 'currentColor' : 'none'}
                    />
                ))}
            </div>

            {showValue ? (
                <span className="text-[10px] font-medium text-muted-foreground">
                    {value > 0 ? value.toFixed(1) : '0.0'}
                    {count !== undefined ? ` (${count})` : ''}
                </span>
            ) : null}
        </div>
    );
}
