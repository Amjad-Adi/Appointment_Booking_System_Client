import { Skeleton } from './Skeleton.tsx';

interface LoadingStateProps {
    label?: string;
    rows?: number;
    className?: string;
}

export function LoadingState({ label = 'Loading...', rows = 4, className = '' }: LoadingStateProps) {
    return (
        <div
            className={`flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-5 ${className}`}
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <span className="sr-only">{label}</span>

            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-3 w-64 max-w-full rounded-md" />

            <div className="mt-2 flex flex-col gap-2">
                {Array.from({ length: rows }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full rounded-lg" />
                ))}
            </div>
        </div>
    );
}
