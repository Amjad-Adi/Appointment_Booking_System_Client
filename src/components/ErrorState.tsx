import { AlertTriangle, RotateCcw } from 'lucide-react';

import { Button } from './Button.tsx';
import { getApiErrorMessage } from '../utlis/api-error.ts';

interface ErrorStateProps {
    error?: unknown;
    title?: string;
    message?: string;
    onRetry?: () => void;
    retryLabel?: string;
    className?: string;
}

export function ErrorState({
    error,
    title = 'Something went wrong',
    message,
    onRetry,
    retryLabel = 'Try again',
    className = '',
}: ErrorStateProps) {
    const errorMessage = message ?? (error ? getApiErrorMessage(error) : undefined);

    return (
        <div
            className={`flex w-full flex-col items-center justify-center rounded-xl border border-destructive-border bg-destructive-soft px-5 py-8 text-center ${className}`}
            role="alert"
        >
            <div className="flex size-10 items-center justify-center rounded-full border border-destructive-border bg-card">
                <AlertTriangle className="size-5 text-destructive" />
            </div>

            <h3 className="mt-3 text-[13px] font-semibold text-foreground">{title}</h3>

            {errorMessage && (
                <p className="mt-1 max-w-md text-[11px] leading-5 text-destructive">{errorMessage}</p>
            )}

            {onRetry && (
                <Button
                    type="button"
                    onClick={onRetry}
                    className="mt-4 flex h-8 items-center gap-1.5 bg-transparent px-3 text-[11px] text-foreground hover:bg-card"
                >
                    <RotateCcw className="size-3.5" />
                    {retryLabel}
                </Button>
            )}
        </div>
    );
}
